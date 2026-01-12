import { motion } from "framer-motion";
import { Network, ZoomIn, ZoomOut, Maximize2, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Visualizer = () => {
  return (
    <div className="space-y-6 h-[calc(100vh-8rem)]">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Permission Visualizer</h1>
          <p className="text-muted-foreground mt-1">Interactive graph of users, roles, and resource relationships</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="glow" size="sm">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Graph Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card flex-1 h-full min-h-[500px] relative overflow-hidden"
      >
        {/* Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <Button variant="glass" size="icon">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="glass" size="icon">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="glass" size="icon">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Legend */}
        <div className="absolute top-4 left-4 glass-card p-4 z-10">
          <h3 className="text-sm font-medium text-foreground mb-3">Legend</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-muted-foreground">Roles</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Resources</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Policies</span>
            </div>
          </div>
        </div>
        
        {/* Graph Visualization (Interactive SVG) */}
        <svg className="w-full h-full" viewBox="0 0 800 600">
          <defs>
            {/* Gradients */}
            <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(187, 100%, 63%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(187, 100%, 63%)" stopOpacity="0.1" />
            </linearGradient>
            
            {/* Glow filters */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Connection Lines */}
          <g className="connections">
            {/* User to Role connections */}
            <motion.line
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              x1="200" y1="300" x2="350" y2="200"
              stroke="url(#linkGradient)" strokeWidth="2"
            />
            <motion.line
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              x1="200" y1="300" x2="350" y2="400"
              stroke="url(#linkGradient)" strokeWidth="2"
            />
            
            {/* Role to Policy connections */}
            <motion.line
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              x1="350" y1="200" x2="500" y2="150"
              stroke="url(#linkGradient)" strokeWidth="2"
            />
            <motion.line
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              x1="350" y1="200" x2="500" y2="250"
              stroke="url(#linkGradient)" strokeWidth="2"
            />
            <motion.line
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              x1="350" y1="400" x2="500" y2="350"
              stroke="url(#linkGradient)" strokeWidth="2"
            />
            <motion.line
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 1.0 }}
              x1="350" y1="400" x2="500" y2="450"
              stroke="url(#linkGradient)" strokeWidth="2"
            />
            
            {/* Policy to Resource connections */}
            <motion.line
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 1.1 }}
              x1="500" y1="150" x2="650" y2="200"
              stroke="url(#linkGradient)" strokeWidth="2"
            />
            <motion.line
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              x1="500" y1="350" x2="650" y2="350"
              stroke="url(#linkGradient)" strokeWidth="2"
            />
            <motion.line
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 1.3 }}
              x1="500" y1="450" x2="650" y2="450"
              stroke="url(#linkGradient)" strokeWidth="2"
            />
          </g>
          
          {/* Nodes */}
          <g className="nodes">
            {/* User Node */}
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <circle cx="200" cy="300" r="30" fill="hsl(187, 100%, 63%)" filter="url(#glow)" opacity="0.2" />
              <circle cx="200" cy="300" r="20" fill="hsl(220, 18%, 8%)" stroke="hsl(187, 100%, 63%)" strokeWidth="2" />
              <text x="200" y="305" textAnchor="middle" fill="hsl(187, 100%, 63%)" fontSize="10" fontWeight="bold">Admin</text>
              <text x="200" y="340" textAnchor="middle" fill="hsl(215, 20%, 55%)" fontSize="10">User</text>
            </motion.g>
            
            {/* Role Nodes */}
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <circle cx="350" cy="200" r="25" fill="hsl(280, 60%, 50%)" filter="url(#glow)" opacity="0.2" />
              <circle cx="350" cy="200" r="18" fill="hsl(220, 18%, 8%)" stroke="hsl(280, 60%, 50%)" strokeWidth="2" />
              <text x="350" y="205" textAnchor="middle" fill="hsl(280, 60%, 70%)" fontSize="9" fontWeight="bold">S3-Full</text>
              <text x="350" y="235" textAnchor="middle" fill="hsl(215, 20%, 55%)" fontSize="10">Role</text>
            </motion.g>
            
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <circle cx="350" cy="400" r="25" fill="hsl(280, 60%, 50%)" filter="url(#glow)" opacity="0.2" />
              <circle cx="350" cy="400" r="18" fill="hsl(220, 18%, 8%)" stroke="hsl(280, 60%, 50%)" strokeWidth="2" />
              <text x="350" y="405" textAnchor="middle" fill="hsl(280, 60%, 70%)" fontSize="9" fontWeight="bold">EC2-Admin</text>
              <text x="350" y="435" textAnchor="middle" fill="hsl(215, 20%, 55%)" fontSize="10">Role</text>
            </motion.g>
            
            {/* Policy Nodes */}
            {[
              { x: 500, y: 150, label: "S3-RW" },
              { x: 500, y: 250, label: "S3-RO" },
              { x: 500, y: 350, label: "EC2-*" },
              { x: 500, y: 450, label: "VPC-R" },
            ].map((policy, index) => (
              <motion.g
                key={policy.label}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <circle cx={policy.x} cy={policy.y} r="22" fill="hsl(38, 92%, 50%)" filter="url(#glow)" opacity="0.2" />
                <circle cx={policy.x} cy={policy.y} r="15" fill="hsl(220, 18%, 8%)" stroke="hsl(38, 92%, 50%)" strokeWidth="2" />
                <text x={policy.x} y={policy.y + 4} textAnchor="middle" fill="hsl(38, 92%, 60%)" fontSize="8" fontWeight="bold">{policy.label}</text>
              </motion.g>
            ))}
            
            {/* Resource Nodes */}
            {[
              { x: 650, y: 200, label: "bucket-1" },
              { x: 650, y: 350, label: "ec2-prod" },
              { x: 650, y: 450, label: "vpc-main" },
            ].map((resource, index) => (
              <motion.g
                key={resource.label}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              >
                <circle cx={resource.x} cy={resource.y} r="25" fill="hsl(160, 84%, 39%)" filter="url(#glow)" opacity="0.2" />
                <circle cx={resource.x} cy={resource.y} r="18" fill="hsl(220, 18%, 8%)" stroke="hsl(160, 84%, 39%)" strokeWidth="2" />
                <text x={resource.x} y={resource.y + 4} textAnchor="middle" fill="hsl(160, 84%, 50%)" fontSize="8" fontWeight="bold">{resource.label}</text>
              </motion.g>
            ))}
          </g>
        </svg>
        
        {/* Center Icon */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-muted-foreground">
          <Network className="w-4 h-4" />
          <span>Click and drag to explore • Scroll to zoom</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Visualizer;
