import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Shield, 
  Key, 
  Smartphone, 
  History, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";

const auditLogs = [
  { date: "Jan 11, 2026 14:32", ip: "192.168.1.45", location: "San Francisco, US", device: "Chrome / macOS" },
  { date: "Jan 10, 2026 09:15", ip: "192.168.1.45", location: "San Francisco, US", device: "Chrome / macOS" },
  { date: "Jan 9, 2026 18:45", ip: "10.0.0.23", location: "New York, US", device: "Safari / iOS" },
  { date: "Jan 8, 2026 11:22", ip: "192.168.1.45", location: "San Francisco, US", device: "Chrome / macOS" },
];

const Profile = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [smsBackup, setSmsBackup] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account security and preferences</p>
      </div>
      
      {/* Account Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Account Overview
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Admin User</h3>
              <p className="text-sm text-muted-foreground">admin@sentineliam.com</p>
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                <Shield className="w-3 h-3" />
                Enterprise Admin
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Display Name</label>
              <input type="text" defaultValue="Admin User" className="terminal-input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address
              </label>
              <input type="email" defaultValue="admin@sentineliam.com" className="terminal-input w-full" disabled />
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border flex justify-end">
          <Button variant="glow">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </motion.div>
      
      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          Password Management
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                className="terminal-input w-full pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                className="terminal-input w-full pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
            <input
              type="password"
              className="terminal-input w-full"
              placeholder="••••••••"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button variant="outline">Update Password</Button>
        </div>
      </motion.div>
      
      {/* Two-Factor Authentication */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Two-Factor Authentication
          </h2>
          {twoFactorEnabled && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium glow-success">
              <CheckCircle className="w-4 h-4" />
              Secure
            </span>
          )}
        </div>
        
        <div className="space-y-4">
          {/* Authenticator App */}
          <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Authenticator App</h3>
                <p className="text-sm text-muted-foreground">Use Google Authenticator or similar apps</p>
              </div>
            </div>
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                twoFactorEnabled ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  twoFactorEnabled ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
          
          {/* SMS Backup */}
          <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-secondary">
                <AlertCircle className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">SMS Backup</h3>
                <p className="text-sm text-muted-foreground">Receive backup codes via SMS</p>
              </div>
            </div>
            <button
              onClick={() => setSmsBackup(!smsBackup)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                smsBackup ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  smsBackup ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Audit Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Recent Login Activity
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left pb-3 text-sm font-medium text-muted-foreground">Date & Time</th>
                <th className="text-left pb-3 text-sm font-medium text-muted-foreground">IP Address</th>
                <th className="text-left pb-3 text-sm font-medium text-muted-foreground">Location</th>
                <th className="text-left pb-3 text-sm font-medium text-muted-foreground">Device</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, index) => (
                <tr key={index} className="border-b border-border/50">
                  <td className="py-3 text-sm text-foreground font-mono">{log.date}</td>
                  <td className="py-3 text-sm text-muted-foreground font-mono">{log.ip}</td>
                  <td className="py-3 text-sm text-muted-foreground">{log.location}</td>
                  <td className="py-3 text-sm text-muted-foreground">{log.device}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
