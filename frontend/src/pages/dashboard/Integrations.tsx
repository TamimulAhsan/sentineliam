import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Ensure this matches your package
import { 
  Cloud, Plus, Check, X, RefreshCw, 
  ExternalLink, Key, AlertCircle, MoreVertical, 
  Pause, Trash2 
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Integration {
  id: string;
  provider: "AWS" | "Azure" | "GCP";
  name: string;
  status: "connected" | "syncing" | "paused" | "error" | "inactive";
  accounts: number;
  lastSync: string;
}

const integrations: Integration[] = [
  { id: "1", provider: "AWS", name: "Production Account", status: "syncing", accounts: 3, lastSync: "2 min ago" },
  { id: "2", provider: "Azure", name: "Azure Enterprise", status: "connected", accounts: 4, lastSync: "5 min ago" },
  { id: "3", provider: "GCP", name: "GCP Main Project", status: "connected", accounts: 2, lastSync: "10 min ago" },
  { id: "4", provider: "GCP", name: "GCP Test Project", status: "paused", accounts: 1, lastSync: "15 min ago" },
  { id: "5", provider: "AWS", name: "Development", status: "error", accounts: 1, lastSync: "1 hour ago" },
];

const providerColors = {
  AWS: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  Azure: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  GCP: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
};

const Integrations = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<"AWS" | "Azure" | "GCP" | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);

  const handleOpenConfig = (integration: Integration) => {
    setEditingIntegration(integration);
    setSelectedProvider(integration.provider);
    setShowModal(true);
    setActiveMenu(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProvider(null);
    setEditingIntegration(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-mono uppercase tracking-tight">Cloud Integrations</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage secure access keys and sync status for cloud providers</p>
        </div>
        <Button variant="glow" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Integration
        </Button>
      </div>
      
      {/* 1. FIXED: Added the Grid Wrapper here */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration, index) => {
          const colors = providerColors[integration.provider];
          const isOpen = activeMenu === integration.id;
        
          return (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-5 relative flex flex-col ${isOpen ? 'z-[100]' : 'z-10'}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${colors.bg}`}>
                    <Cloud className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{integration.name}</h3>
                    <span className={`text-[10px] font-bold uppercase ${colors.text}`}>{integration.provider}</span>
                  </div>
                </div>
                
                <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                  integration.status === "connected" ? "bg-success/10 text-success" : 
                  integration.status === "syncing" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                }`}>
                  {integration.status === "syncing" && <RefreshCw className="w-3 h-3 animate-spin" />}
                  {integration.status}
                </div>
              </div>
              
              {/* Details */}
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Accounts</span>
                  <span className="text-foreground font-medium">{integration.accounts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Sync</span>
                  <span className="text-foreground">{integration.lastSync}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-border mt-auto">
                <Button variant="ghost" size="sm" className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync
                </Button>
        
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleOpenConfig(integration)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Configure
                </Button>

                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(isOpen ? null : integration.id);
                    }}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>

                  <AnimatePresence>
                    {isOpen && (
                      <>
                        <div className="fixed inset-0 z-[110]" onClick={() => setActiveMenu(null)} />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -5 }}
                          className="absolute top-full right-0 mt-2 w-36 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-[120] overflow-hidden"
                        >
                          <div className="py-1">
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-xs text-foreground hover:bg-slate-800 transition-colors text-left" onClick={() => setActiveMenu(null)}>
                              <Pause className="w-3.5 h-3.5 text-warning" /> Pause
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors text-left border-t border-slate-800" onClick={() => setActiveMenu(null)}>
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {/* Add New Card - inside the same grid */}
        <motion.button
          onClick={() => setShowModal(true)}
          className="glass-card p-5 border-2 border-dashed border-border hover:border-primary/50 transition-all flex flex-col items-center justify-center min-h-[200px] text-muted-foreground hover:text-primary group"
        >
          <div className="p-4 rounded-full bg-secondary/30 group-hover:bg-primary/10 transition-colors">
            <Plus className="w-8 h-8" />
          </div>
          <span className="font-medium mt-4">Add Cloud Provider</span>
        </motion.button>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4">
                <h2 className="text-xl font-bold text-foreground">
                  {editingIntegration ? `Configure ${editingIntegration.name}` : "New Integration"}
                </h2>
                <button onClick={closeModal} className="p-2 hover:bg-secondary rounded-lg transition-colors"><X className="w-5 h-5" /></button>
              </div>
              
              {!selectedProvider ? (
                <div className="grid md:grid-cols-3 gap-4">
                  {(["AWS", "Azure", "GCP"] as const).map((p) => (
                    <button key={p} onClick={() => setSelectedProvider(p)} className={`p-6 rounded-xl border ${providerColors[p].border} ${providerColors[p].bg} hover:scale-[1.02] transition-transform`}>
                      <Cloud className={`w-10 h-10 ${providerColors[p].text} mb-4 mx-auto`} />
                      <p className="font-bold text-foreground">{p}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Setup Protocol</h3>
                    <div className="space-y-4 text-xs">
                      {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="flex gap-3 text-muted-foreground leading-relaxed">
                          <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">{step}</span>
                          <p>Required {selectedProvider} configuration step {step} for secure IAM handshake.</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">Account Alias</label>
                      <input type="text" className="terminal-input w-full" defaultValue={editingIntegration?.name || ""} placeholder="e.g., Production-01" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">Access Key ID</label>
                      <input type="text" className="terminal-input w-full font-mono text-xs" defaultValue={editingIntegration ? "AKIA-SAMPLE-KEY-12345" : ""} placeholder="AKIA..." />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">Secret Access Key</label>
                      <input type="password" className="terminal-input w-full text-xs" defaultValue={editingIntegration ? "SAMPLE-SECRET" : ""} placeholder="••••••••••••••••" />
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-border/50">
                      <Button variant="glow" onClick={closeModal} className="flex-1">
                        {editingIntegration ? "Update" : "Connect"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Integrations;