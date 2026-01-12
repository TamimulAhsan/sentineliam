import { motion } from "framer-motion";
import { Shield, ArrowRight, Lock, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MockDashboard from "./MockDashboard";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Background Grid */}
      <div className="absolute inset-0 cyber-grid opacity-50" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm"
            >
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Enterprise-Grade Security</span>
            </motion.div>
            
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="gradient-text">Zero-Trust IAM</span>
              <br />
              <span className="text-foreground">Orchestration for the</span>
              <br />
              <span className="text-foreground">Multi-Cloud Era</span>
            </h1>
            
            {/* Sub-headline */}
            <p className="text-lg text-muted-foreground max-w-xl">
              Audit, visualize, and harden your AWS, Azure, and GCP permissions in real-time. 
              Take control of your cloud security posture with intelligent automation.
            </p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/auth">
                <Button variant="hero" size="xl" className="group animate-glow-pulse">
                  <Lock className="w-5 h-5" />
                  Secure Your Cloud Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="glass" size="xl">
                <Fingerprint className="w-5 h-5" />
                Watch Demo
              </Button>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-6 pt-4"
            >
              <div className="flex items-center gap-2">
                <div className="status-dot-success" />
                <span className="text-sm text-muted-foreground">SOC2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="status-dot-success" />
                <span className="text-sm text-muted-foreground">GDPR Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="status-dot-success" />
                <span className="text-sm text-muted-foreground">ISO 27001</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Content - Mock Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <MockDashboard />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
