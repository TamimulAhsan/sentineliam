export const MOCK_POLICIES = [
  {
    id: 1,
    name: "ReadOnlyAccess-S3",
    entity_name: "marketing-app-role",
    platform: "aws" as const,
    risk_score: 15,
    is_vulnerable: false,
    finding_details: {
      issues: ["Policy allows global read access to S3, but lacks write permissions."]
    },
    document: {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: ["s3:Get*", "s3:List*"],
          Resource: "*"
        }
      ]
    },
    updated_at: "2026-01-10T14:30:00Z"
  },
  {
    id: 2,
    name: "Admin-Privilege-Escalation",
    entity_name: "dev-user-01",
    platform: "aws" as const,
    risk_score: 95,
    is_vulnerable: true,
    finding_details: {
      issues: [
        "Critical: Full Administrator Access (* on *)",
        "High: Potential for Identity Privilege Escalation"
      ]
    },
    document: {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: "*",
          Resource: "*"
        }
      ]
    },
    updated_at: "2026-01-11T09:15:00Z"
  },
  {
    id: 3,
    name: "Azure-Contributor-Role",
    entity_name: "aks-service-principal",
    platform: "azure" as const,
    risk_score: 45,
    is_vulnerable: false,
    finding_details: {
      issues: ["Medium: Broad contributor permissions on subscription scope."]
    },
    document: {
      actions: ["Microsoft.Compute/*", "Microsoft.Network/*", "Microsoft.Storage/*"],
      notActions: [],
      assignableScopes: ["/subscriptions/sub-id-123"]
    },
    updated_at: "2026-01-08T11:00:00Z"
  }
];