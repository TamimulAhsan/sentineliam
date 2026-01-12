import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Search, Filter, AlertTriangle, 
  CheckCircle, Clock, Eye, Edit2, Trash2, X, RefreshCw, Loader,
  ArrowUpDown, ArrowUp, ArrowDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPolicies, updatePolicy, deletePolicy } from '../../components/policies/api'; 
import PolicyEditor from '../../components/policies/components/PolicyEditor';
import { IAMPolicy } from '../../components/policies/components/PolicyEditor';
import { useToast } from "@/components/ui/use-toast";


const platformColors = {
  aws: "text-amber-400",
  azure: "text-blue-400",
  gcp: "text-red-400",
};

const Policies = () => {
  const { toast } = useToast();
  // 1. STATE MANAGEMENT
  const [policies, setPolicies] = useState<IAMPolicy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  // Modal & Editing State
  const [editingPolicy, setEditingPolicy] = useState<IAMPolicy | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorInitialMode, setEditorInitialMode] = useState(true);

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  const toggleSort = () => {
    setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
  };

  
  //complex filter state
  const [filters, setFilters] = useState({
    platforms: [] as string[],
    minRisk: 0,
    maxRisk: 100,
  });

  // 2. DATA FETCHING
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setIsLoading(true);
        const data = await getPolicies();
        setPolicies(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
        toast({
          variant: "destructive",
          title: "Error Fetching Policies",
          description: err.message,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPolicies();
  }, [toast]);


  // 3. HANDLERS
  const handleViewClick = (policy: IAMPolicy) => {
    setEditingPolicy(policy);
    setEditorInitialMode(true); // Force Read-Only
    setIsEditorOpen(true);
  };

  const handleEditClick = (policy: IAMPolicy) => {
    setEditingPolicy(policy);
    setEditorInitialMode(false); // Force Write Mode
    setIsEditorOpen(true);
  };

  const handleSave = async (id: number | string, updatedDoc: object) => {
    try {
      const updatedPolicy = await updatePolicy(id, updatedDoc);
      setPolicies(prev => prev.map(p => (p.id === id ? updatedPolicy : p)));
      toast({
        title: "Policy Updated",
        description: `Successfully updated ${updatedPolicy.name}.`,
      });
      setIsEditorOpen(false);
      setEditingPolicy(null);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: err.message,
      });
    }
  };

  const handleDelete = async (id: number | string) => {
    // Optimistic UI update
    const originalPolicies = policies;
    setPolicies(prev => prev.filter(p => p.id !== id));

    try {
      await deletePolicy(id);
      toast({
        title: "Policy Deleted",
        description: "The policy has been successfully removed.",
      });
    } catch (err: any) {
      // Revert on error
      setPolicies(originalPolicies);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: err.message,
      });
    }
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

  const sortedPolicies = [...filteredPolicies].sort((a, b) => {
    if (!sortOrder) return 0;
    return sortOrder === 'desc' 
    ? b.risk_score - a.risk_score 
    : a.risk_score - b.risk_score;
  });

  const togglePlatform = (p: string) => {
    setFilters(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p) 
        ? prev.platforms.filter(x => x !== p) 
        : [...prev.platforms, p]
    }));
  };

  // UI Components for Loading/Error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 glass-card border-destructive/50">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Failed to Load Policies</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }


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
        <StatCard icon={<CheckCircle className="text-success" />} label="Compliant" value={policies.filter(p => !p.is_vulnerable).length} delay={0} />
        <StatCard icon={<AlertTriangle className="text-destructive" />} label="Violations" value={policies.filter(p => p.is_vulnerable).length} delay={0.1} />
        <StatCard icon={<Clock className="text-warning" />} label="Total Policies" value={policies.length} delay={0.2} />
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
                  onClick={() => setFilters({ platforms: [], minRisk: 0, maxRisk: 100 })}
                >
                  <RefreshCw className="w-3 h-3 mr-2" />
                  Reset Filters
                </Button>
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
              <th 
                onClick={toggleSort}
                className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-indigo-400 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  Risk Score
                  <span className="text-slate-500 group-hover:text-indigo-400">
                    {sortOrder === 'desc' ? (
                      <ArrowDown size={14} className="text-indigo-400" />
                    ) : sortOrder === 'asc' ? (
                      <ArrowUp size={14} className="text-indigo-400" />
                    ) : (
                      <ArrowUpDown size={14} />
                    )}
                  </span>
                </div>
              </th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPolicies.map((policy) => (
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
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(policy.id)}>
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
                  onSave={(id, updatedDoc) => handleSave(id, updatedDoc)}
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