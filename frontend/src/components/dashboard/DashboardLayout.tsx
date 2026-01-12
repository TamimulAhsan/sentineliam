import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, Outlet } from "react-router-dom";
import { 
  Shield, 
  LayoutDashboard, 
  Cloud, 
  FileText, 
  Network, 
  User,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  BarChart2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { path: "/dashboard/policies", icon: FileText, label: "Policies" },
  { path: "/dashboard/charts", icon: BarChart2, label: "Charts"},
  { path: "/dashboard/visualizer", icon: Network, label: "Visualizer" },
  { path: "/dashboard/integrations", icon: Cloud, label: "Integrations" },
];

const DashboardLayout = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [hasAlerts] = useState(true);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 bottom-0 bg-sidebar border-r border-sidebar-border flex flex-col z-40"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-bold text-foreground whitespace-nowrap"
                >
                  SentinelIAM
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* Bottom Section */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Link
            to="/dashboard/profile"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              location.pathname === "/dashboard/profile"
                ? "bg-primary/10 text-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <User className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  Profile
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
        
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 p-1.5 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </motion.aside>
      
      {/* Main Content */}
      <div 
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: collapsed ? 80 : 260 }}
      >
        {/* Top Bar */}
        <header className="h-16 bg-background/80 backdrop-blur-xl border-b border-border sticky top-0 z-30 flex items-center justify-between px-6">
          {/* Search */}
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search resources, policies, users..."
              className="w-full terminal-input pl-10 py-2 text-sm"
            />
          </div>
          
          {/* Right Actions */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {hasAlerts && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full animate-pulse" />
              )}
            </button>
            
            {/* User Avatar */}
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-foreground">Admin User</p>
                <p className="text-xs text-muted-foreground">Enterprise</p>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
