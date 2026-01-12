import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Search, Filter, AlertTriangle, 
  CheckCircle, Clock, Eye, Edit2, Trash2, X, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_POLICIES } from '../../components/policies/mockdata'; 
import PolicyEditor from '../../components/policies/components/PolicyEditor';
import { IAMPolicy } from '../../components/policies/components/PolicyEditor';


// Updated interface to match your Mock Data + UI needs
interface Policy {
  id: string | number;
  name: string;
  platform: "aws" | "azure" | "gcp"; // Matching MockData
  entity_name: string;
  status?: "compliant" | "violation" | "pending";
  risk_score: number;
  is_vulnerable: boolean;
  lastModified?: string;
  document: any;
  finding_details: { issues: string[] };
}

const platformColors = {
  aws: "text-amber-400",
  azure: "text-blue-400",
  gcp: "text-red-400",
};

const Policies = () => {
  // 1. STATE MANAGEMENT
  const [policies, setPolicies] = useState<IAMPolicy[]>(MOCK_POLICIES as IAMPolicy[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  // Modal & Editing State
  const [editingPolicy, setEditingPolicy] = useState<IAMPolicy | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorInitialMode, setEditorInitialMode] = useState(true);


  //complex filter state
  const [filters, setFilters] = useState({
    platforms: [] as string[],
    minRisk: 0,
    maxRisk: 100,
    entityType: "all", // e.g., 'User', 'Role', 'Group' if data supports it
  });
  // 2. HANDLERS
  const handleViewClick = (policy: IAMPolicy) => {
  setEditingPolicy(policy);
  setEditorInitialMode(true); // Force Read-Only
  setIsEditorOpen(true);
};

  const handleEditClick = (policy: IAMPolicy) => {
  setEditingPolicy(policy);
  setEditorInitialMode(false); // Force Write Mode
  setIsEditorOpen(true);
};;

  const handleSave = async (id: number | string, updatedDoc: object) => {
    console.log("Saving Policy ID:", id, updatedDoc);
    
    // In a real app, you'd await an API call here
    setPolicies(prev => prev.map(p => 
      p.id === id ? { 
        ...p, 
        document: updatedDoc, 
        lastModified: "Just now",
        // Logic: if they fixed the wildcard, maybe it's no longer a violation?
        status: "compliant",
        is_vulnerable: false,
        risk_score: 0
      } : p
    ));
    
    setIsEditorOpen(false);
    setEditingPolicy(null);
  };

  //filtering logic
  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch = policy.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          policy.entity_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPlatform = 
      filters.platforms.length === 0 || filters.platforms.includes(policy.platform);
    
    const matchesRisk = 
      policy.risk_score >= filters.minRisk && policy.risk_score <= filters.maxRisk;
    
    return matchesSearch && matchesPlatform && matchesRisk;
  });

  const togglePlatform = (p: string) => {
    setFilters(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p) 
        ? prev.platforms.filter(x => x !== p) 
        : [...prev.platforms, p]
    }));
  };

  return (
    <div className="space-y-6 relative">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-mono">Policy Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">Audit and manage IAM policies across multi-cloud environments</p>
        </div>
        <Button variant="glow" className="gap-2">
          <FileText className="w-4 h-4" />
          Run Global Audit
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={<CheckCircle className="text-success" />} label="Compliant" value="847" delay={0} />
        <StatCard icon={<AlertTriangle className="text-destructive" />} label="Violations" value="23" delay={0.1} />
        <StatCard icon={<Clock className="text-warning" />} label="Pending" value="12" delay={0.2} />
      </div>
      
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="terminal-input w-full pl-10"
            placeholder="Search policies or entities..."
          />
        </div>
        <Button 
          variant={isFilterVisible ? "glow" : "secondary"} 
          className="gap-2"
          onClick={() => setIsFilterVisible(!isFilterVisible)}
        >
          <Filter className="w-4 h-4" />
          Filters {(filters.platforms.length > 0 || filters.minRisk > 0 || filters.maxRisk < 100) && "•"}
        </Button>
      </div>

      <AnimatePresence>
        {isFilterVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-6 grid grid-cols-1 md:grid-cols-3 gap-8 border-indigo-500/20">
              {/* Platform Filter */}
              <div>
                <h4 className="text-[10px] font-bold uppercase text-muted-foreground mb-4 tracking-widest">Provider Platform</h4>
                <div className="flex gap-2">
                  {["aws", "azure", "gcp"].map((p) => (
                    <button
                      key={p}
                      onClick={() => togglePlatform(p)}
                      className={`px-3 py-1.5 rounded-md border text-xs font-bold uppercase transition-all ${
                        filters.platforms.includes(p) 
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' 
                        : 'border-border text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Risk Score Range */}
              <div>
                <h4 className="text-[10px] font-bold uppercase text-muted-foreground mb-4 tracking-widest">
                  Risk Score Range: {filters.minRisk} - {filters.maxRisk}
                </h4>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" min="0" max="100" value={filters.minRisk}
                    onChange={(e) => setFilters({...filters, minRisk: parseInt(e.target.value)})}
                    className="w-full accent-indigo-500"
                  />
                  <input 
                    type="range" min="0" max="100" value={filters.maxRisk}
                    onChange={(e) => setFilters({...filters, maxRisk: parseInt(e.target.value)})}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>

              {/* Reset Controls */}
              <div className="flex items-end justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setFilters({ platforms: [], minRisk: 0, maxRisk: 100, entityType: "all" })}
                >
                  <RefreshCw className="w-3 h-3 mr-2" />
                  Reset Filters
                </Button>
                {/* <p className="text-[10px] text-slate-600 italic">
                  Showing {filteredPolicies.length} of {policies.length} total policies
                </p> */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Policies Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-secondary/20">
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Policy Name</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Platform</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Entity</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Risk Score</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPolicies.map((policy, index) => (
              <tr key={policy.id} className="border-b border-border/50 hover:bg-secondary/10 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono text-sm font-medium">{policy.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`text-xs font-bold uppercase ${platformColors[policy.platform]}`}>
                    {policy.platform}
                  </span>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{policy.entity_name}</td>
                <td className="p-4">
                  <span className={`text-sm font-bold ${policy.is_vulnerable ? 'text-destructive' : 'text-success'}`}>
                    {policy.risk_score}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewClick(policy)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(policy)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* 3. THE EDITOR MODAL */}
      <AnimatePresence>
        {isEditorOpen && editingPolicy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-6xl h-[85vh] flex flex-col relative shadow-2xl border-indigo-500/30"
            >
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute top-4 right-4 z-20 hover:bg-destructive/20"
                onClick={() => setIsEditorOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="flex-1 overflow-hidden">
                <PolicyEditor 
                  policy={editingPolicy} 
                  initialReadOnly={editorInitialMode}
                  onSave={(id, doc) => handleSave(id, doc)} 
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper Stat Card Component
const StatCard = ({ icon, label, value, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-4 flex items-center gap-4 border-l-4 border-l-indigo-500"
  >
    <div className="p-3 rounded-xl bg-secondary/50">{icon}</div>
    <div>
      <p className="text-2xl font-bold font-mono">{value}</p>
      <p className="text-xs text-muted-foreground uppercase tracking-widest">{label}</p>
    </div>
  </motion.div>
);

export default Policies;