// src/features/policies/components/PolicyEditor.tsx
import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Save, AlertTriangle, CheckCircle, ShieldCheck, Edit3 } from 'lucide-react';

export interface IAMPolicy {
  id: number | string;
  name: string;
  entity_name: string;
  platform: 'aws' | 'azure' | 'gcp';
  document: any;
  risk_score: number;
  is_vulnerable: boolean;
  finding_details: {
    issues: string[];
  };
}

interface PolicyEditorProps {
  policy: IAMPolicy;
  onSave: (id: any, updatedDoc: object) => Promise<void>;
  initialReadOnly?: boolean;
}

const PolicyEditor: React.FC<PolicyEditorProps> = ({ policy, onSave, initialReadOnly = true }) => {
  const [code, setCode] = useState<string | undefined>(
    JSON.stringify(policy.document, null, 2)
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [readOnly, setReadOnly] = useState<boolean>(initialReadOnly);

  useEffect(() => {
    setCode(JSON.stringify(policy.document, null, 2));
    setReadOnly(initialReadOnly);
  }, [policy, initialReadOnly]);

  const handleSave = async () => {
    if (!code) return;
    try {
      setIsSaving(true);
      const updatedDoc = JSON.parse(code);
      await onSave(policy.id, updatedDoc);
    } catch (e) {
      alert("Invalid JSON syntax. Please fix errors before saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden">
      {/* 1. Header (Info Only) */}
      <div className="flex items-center justify-between p-4 bg-slate-800/50 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-mono text-sm leading-none mb-1">{policy.name}</h3>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              {policy.platform} • {policy.entity_name}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* 2. Sidebar Findings */}
        <div className="w-72 p-4 bg-slate-800/30 border-r border-slate-700 overflow-y-auto">
          <div className={`mb-4 p-3 rounded border ${policy.is_vulnerable ? 'bg-red-500/10 border-red-500/50' : 'bg-emerald-500/10 border-emerald-500/50'}`}>
            <p className={`text-[10px] font-bold uppercase tracking-tighter ${policy.is_vulnerable ? 'text-red-400' : 'text-emerald-400'}`}>
              Security Risk Score
            </p>
            <p className="text-xl font-mono font-bold">{policy.risk_score}/100</p>
          </div>
          
          <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3">Analysis Findings</h4>
          <ul className="space-y-3">
            {policy.finding_details.issues.map((issue, i) => (
              <li key={i} className="text-xs text-slate-300 flex gap-2 leading-relaxed">
                <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                {issue}
              </li>
            ))}
          </ul>
        </div>

        {/* Editor Instance */}
        <div className="flex-1 relative">
          <Editor
            height="100%"
            defaultLanguage="json"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value)}
            options={{
              readOnly: readOnly, // Locks the editor
              fontSize: 13,
              minimap: { enabled: false },
              automaticLayout: true,
              domReadOnly: readOnly,
            }}
          />

          {/* 4. BOTTOM RIGHT SAVE BUTTON */}
          <div className="absolute bottom-6 right-6 z-10">
            {readOnly ? (
              <button 
                onClick={() => setReadOnly(false)}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-2xl transition-all border border-slate-500/30"
              >
                <Edit3 size={18} />
                Edit Policy
              </button>
            ) : (
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-2xl shadow-indigo-500/20 transition-all border border-indigo-400/30"
              >
                <Save size={18} />
                {isSaving ? "Syncing..." : "Apply Changes"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyEditor;