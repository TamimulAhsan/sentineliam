import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Calendar, ChevronDown, Activity, ShieldAlert, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Mock Data: Showing Risk Scores across different platforms over time
const securityTrendData = [
  { time: '00:00', aws: 45, azure: 32, gcp: 20, total: 97 },
  { time: '04:00', aws: 42, azure: 35, gcp: 22, total: 99 },
  { time: '08:00', aws: 55, azure: 40, gcp: 25, total: 120 },
  { time: '12:00', aws: 48, azure: 52, gcp: 30, total: 130 },
  { time: '16:00', aws: 38, azure: 45, gcp: 28, total: 111 },
  { time: '20:00', aws: 30, azure: 38, gcp: 24, total: 92 },
  { time: '23:59', aws: 25, azure: 30, gcp: 20, total: 75 },
];

const Charts = () => {
  const [timeRange, setTimeRange] = useState('Real-time Stream');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-mono tracking-tighter">TELEMETRY_ANALYTICS</h1>
          <p className="text-muted-foreground mt-1 text-sm italic">Real-time risk ingestion and policy propagation waves</p>
        </div>
        
        <Button variant="outline" className="gap-2 border-indigo-500/30 bg-indigo-500/5 text-indigo-400 hover:bg-indigo-500/10 h-10">
          <Calendar className="w-4 h-4" />
          {timeRange}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* 1. Multi-Series Line Chart: Multi-Cloud Risk Comparison */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 h-[450px] border-indigo-500/20"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Activity className="text-indigo-500 w-5 h-5 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">Cross-Platform Risk Propagation</h3>
            </div>
            <div className="flex gap-4 text-[10px] font-mono">
              <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-400"/> AWS</span>
              <span className="flex items-center gap-1.5 text-blue-400"><span className="w-2 h-2 rounded-full bg-blue-400"/> AZURE</span>
              <span className="flex items-center gap-1.5 text-red-400"><span className="w-2 h-2 rounded-full bg-red-400"/> GCP</span>
            </div>
          </div>
          
          <div className="flex-1 h-full pb-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={securityTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '4px', fontSize: '10px' }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 1 }}
                />
                <Line type="monotone" dataKey="aws" stroke="#fbbf24" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="azure" stroke="#60a5fa" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="gcp" stroke="#f87171" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 2. Area Chart: Total Policy Volume Handshake */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 h-[350px]"
          >
            <div className="flex items-center gap-2 mb-6">
              <Zap className="text-indigo-400 w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Policy Load</h3>
            </div>
            <div className="h-full pb-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={securityTrendData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ display: 'none' }} />
                  <Area type="stepAfter" dataKey="total" stroke="#6366f1" fill="url(#colorTotal)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* 3. Combined Risk Velocity */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 h-[350px]"
          >
            <div className="flex items-center gap-2 mb-6">
              <ShieldAlert className="text-red-400 w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Risk Velocity (Aggregate)</h3>
            </div>
            <div className="h-full pb-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={securityTrendData}>
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#020617', border: 'none', color: '#fff' }}
                     labelStyle={{ display: 'none' }}
                  />
                  <Line 
                    type="basis" 
                    dataKey="total" 
                    stroke="#ef4444" 
                    strokeWidth={4} 
                    dot={false}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Charts;