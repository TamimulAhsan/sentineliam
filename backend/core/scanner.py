class SecurityScanner:
    def __init__(self, doc):
        self.doc = doc or {}
        self.findings = []
        self.risk_score = 0

    def scan_aws(self):
        """AWS IAM Policy Scanner"""
        statements = self.doc.get('Statement', [])
        if isinstance(statements, dict): statements = [statements]

        for stmt in statements:
            if stmt.get('Effect') == 'Allow':
                actions = stmt.get('Action', [])
                if isinstance(actions, str): actions = [actions]
                resource = stmt.get('Resource', '')

                # 1. Critical: Wildcard Admin
                if "*" in actions and resource == "*":
                    self.add_finding("Critical: Full Administrator Access (Action: *, Resource: *)", 95)

                # 2. High: Privilege Escalation Vectors
                priv_esc_actions = [
                    'iam:PutUserPolicy', 'iam:AttachUserPolicy', 
                    'iam:CreatePolicyVersion', 'iam:PassRole'
                ]
                if any(a in actions for a in priv_esc_actions):
                    self.add_finding("High: Privilege Escalation potential detected.", 80)

                # 3. Medium: Data Exfiltration risk
                if "s3:*" in actions or "s3:GetObject" in actions:
                    if resource == "*":
                        self.add_finding("Medium: Global S3 Read/Write access.", 50)

        return self.normalize_score(), self.findings

    def scan_azure(self):
        """Azure RBAC Scanner"""
        actions = self.doc.get('actions', [])
        
        # 1. Critical: Owner/Contributor equivalent
        if "*" in actions:
            self.add_finding("Critical: Wildcard permissions (Owner equivalent) found.", 90)
        
        # 2. High: High-impact actions
        if "Microsoft.Compute/virtualMachines/runCommand/action" in actions:
            self.add_finding("High: Ability to run commands on VMs detected.", 75)

        return self.normalize_score(), self.findings

    def scan_gcp(self):
        """GCP IAM Scanner (Simplified for MVP)"""
        # GCP Logic usually checks for Primitive Roles
        role_name = self.doc.get('role', '')
        if "roles/owner" in role_name.lower():
            self.add_finding("Critical: Primitive 'Owner' role detected.", 95)
        elif "roles/editor" in role_name.lower():
            self.add_finding("High: Primitive 'Editor' role detected.", 70)

        return self.normalize_score(), self.findings

    def add_finding(self, message, score):
        self.findings.append(message)
        self.risk_score += score

    def normalize_score(self):
        # Ensure score stays between 0 and 100
        return min(self.risk_score, 100)

    def get_ai_analysis(self):
        """Placeholder for LLM Integration"""
        # Here you would send self.doc to an LLM like Gemini or GPT-4
        # return "AI Insight: This policy allows user X to delete the entire production DB."
        pass