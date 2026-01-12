import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, Cloud, Users, Key } from "lucide-react";

const MockDashboard = () => {
  return (
    <div className="relative">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-2xl" />
      
      {/* Dashboard Container */}
      <motion.div
        initial={{ rotateY: -10, rotateX: 5 }}
        animate={{ rotateY: 0, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative glass-card p-6 rounded-2xl animate-float"
        style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-semibold text-foreground">Security Overview</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Live</span>
            <div className="status-dot-success" />
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-background/50 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Cloud className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Cloud Accounts</span>
            </div>
            <span className="text-2xl font-bold text-foreground">12</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-background/50 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Identities</span>
            </div>
            <span className="text-2xl font-bold text-foreground">2.4k</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-background/50 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Policies</span>
            </div>
            <span className="text-2xl font-bold text-foreground">847</span>
          </motion.div>
        </div>
        
        {/* Alerts Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-foreground">Recent Findings</span>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
            className="flex items-center gap-3 bg-destructive/10 border border-destructive/30 rounded-lg p-3"
          >
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <div className="flex-1">
              <span className="text-sm text-foreground">Overprivileged IAM Role</span>
              <span className="text-xs text-muted-foreground ml-2">AWS • 2 min ago</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            className="flex items-center gap-3 bg-success/10 border border-success/30 rounded-lg p-3"
          >
            <CheckCircle className="w-4 h-4 text-success" />
            <div className="flex-1">
              <span className="text-sm text-foreground">MFA Enforced</span>
              <span className="text-xs text-muted-foreground ml-2">Azure • 15 min ago</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3 }}
            className="flex items-center gap-3 bg-warning/10 border border-warning/30 rounded-lg p-3"
          >
            <AlertTriangle className="w-4 h-4 text-warning" />
            <div className="flex-1">
              <span className="text-sm text-foreground">Unused Service Account</span>
              <span className="text-xs text-muted-foreground ml-2">GCP • 1 hour ago</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default MockDashboard;
