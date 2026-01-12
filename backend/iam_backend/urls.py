from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import CloudAccountViewSet, IAMPolicyViewSet
from core.views import RegisterView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'accounts', CloudAccountViewSet, basename='cloudaccount')
router.register(r'policies', IAMPolicyViewSet, basename='iampolicy')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    # For user auth (Login/Logout)
    path('api-auth/', include('rest_framework.urls')),
    path('api/auth/register/', RegisterView.as_view(), name='auth_register'),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]