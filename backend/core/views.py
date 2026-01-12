from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import CloudAccount, IAMEntity, IAMPolicy
from .tasks import sync_cloud_iam
from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import CloudAccountSerializer, UserSerializer, IAMPolicySerializer
from .scanner import SecurityScanner
from .utils import set_policy_in_cloud, delete_policy_in_cloud

class CloudAccountViewSet(viewsets.ModelViewSet):
    serializer_class = CloudAccountSerializer

    def get_queryset(self):
        # Security: Users should only see their own cloud accounts
        return CloudAccount.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically link the account to the logged-in user
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def trigger_sync(self, request, pk=None):
        """Custom endpoint to start a background scan: /api/accounts/{id}/trigger_sync/"""
        account = self.get_object()
        
        # Trigger the Celery task (using .delay() so it doesn't block)
        task = sync_cloud_iam.delay(account.id)
        
        return Response({
            "status": "Sync started",
            "task_id": task.id
        }, status=status.HTTP_202_ACCEPTED)

class IAMEntityViewSet(viewsets.ReadOnlyModelViewSet):
    """View to list users/roles found in the cloud"""
    # ... logic to filter by cloud_account





User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,) # Anyone can sign up
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens automatically upon signup (Auto-login)
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": serializer.data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })
    


class IAMPolicyViewSet(viewsets.ModelViewSet):
    serializer_class = IAMPolicySerializer

    def get_queryset(self):
        return IAMPolicy.objects.filter(entity__cloud_account__user=self.request.user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        new_doc = request.data.get('document')

        # 1. Update the cloud provider
        if set_policy_in_cloud(instance, new_doc):
            # 2. Re-scan the new policy locally for risk
            scanner = SecurityScanner(new_doc)
            platform = instance.entity.cloud_account.platform
            
            if platform == 'aws': score, findings = scanner.scan_aws()
            elif platform == 'azure': score, findings = scanner.scan_azure()
            else: score, findings = 0, []

            # 3. Save to local Database
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            serializer.save(
                risk_score=score,
                finding_details={"issues": findings},
                is_vulnerable=score > 50
            )
            return Response(serializer.data)
        
        return Response({"error": "Failed to update cloud provider"}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if delete_policy_in_cloud(instance):
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "Failed to delete from cloud"}, status=status.HTTP_400_BAD_REQUEST)