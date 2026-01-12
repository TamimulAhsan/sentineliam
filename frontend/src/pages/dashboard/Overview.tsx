import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Shield, 
  Cloud, 
  Users, 
  Key, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const stats = [
  { 
    label: "Cloud Accounts", 
    value: "12", 
    change: "+2", 
    trend: "up",
    icon: Cloud,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10"
  },
  { 
    label: "Total Identities", 
    value: "2,847", 
    change: "+124", 
    trend: "up",
    icon: Users,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10"
  },
  { 
    label: "Active Policies", 
    value: "847", 
    change: "-23", 
    trend: "down",
    icon: Key,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10"
  },
  { 
    label: "Security Score", 
    value: "94", 
    change: "+5", 
    trend: "up",
    icon: Shield,
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
];

const alerts = [
  { 
    type: "critical", 
    title: "Overprivileged IAM Role Detected", 
    source: "AWS", 
    time: "2 min ago",
    details: "Role 'admin-lambda' has wildcard permissions"
  },
  { 
    type: "warning", 
    title: "Unused Service Account", 
    source: "GCP", 
    time: "1 hour ago",
    details: "Service account inactive for 90+ days"
  },
  { 
    type: "success", 
    title: "MFA Enforcement Complete", 
    source: "Azure", 
    time: "3 hours ago",
    details: "All users now have MFA enabled"
  },
  { 
    type: "warning", 
    title: "Expiring Access Keys", 
    source: "AWS", 
    time: "5 hours ago",
    details: "3 access keys expire in next 7 days"
  },
];

const cloudHealth = [
  { provider: "AWS", status: "healthy", accounts: 5, findings: 12 },
  { provider: "Azure", status: "healthy", accounts: 4, findings: 8 },
  { provider: "GCP", status: "warning", accounts: 3, findings: 24 },
];

const Overview = () => {
  const navigate = useNavigate();
  const handleViewAllViolations = () => {
    // We send a signal via the URL that we only want to see 'vulnerable' policies
    navigate("./policies");
  };
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Security Overview</h1>
          <p className="text-muted-foreground mt-1">Manage and Monitor your multi-cloud IAM posture in real-time</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="status-dot-success" />
          <span>All systems operational</span>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                stat.trend === "up" ? "text-success" : "text-destructive"
              }`}>
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>
      
      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Alerts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Recent Findings</h2>
            <button
              onClick={handleViewAllViolations}
              className="text-sm text-primary hover:underline hover:text-primary/80 transition-colors font-medium"
            >
              View all
            </button>
          </div>
          
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`flex items-start gap-4 p-4 rounded-lg border ${
                  alert.type === "critical" 
                    ? "bg-destructive/5 border-destructive/20" 
                    : alert.type === "warning"
                    ? "bg-warning/5 border-warning/20"
                    : "bg-success/5 border-success/20"
                }`}
              >
                {alert.type === "critical" ? (
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                ) : alert.type === "warning" ? (
                  <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground">{alert.title}</h3>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                      {alert.source}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.details}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Cloud Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Cloud Health</h2>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            {cloudHealth.map((cloud, index) => (
              <motion.div
                key={cloud.provider}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="p-4 bg-background/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      cloud.status === "healthy" ? "bg-success" : "bg-warning"
                    }`} />
                    <span className="font-medium text-foreground">{cloud.provider}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {cloud.accounts} accounts
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Open findings</span>
                  <span className={`font-medium ${
                    cloud.findings > 20 ? "text-warning" : "text-foreground"
                  }`}>
                    {cloud.findings}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Overview;
