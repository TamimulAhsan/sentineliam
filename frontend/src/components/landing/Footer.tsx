import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 bg-card/30">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-foreground">SentinelIAM</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Security</a>
            <a href="#" className="hover:text-foreground transition-colors">Status</a>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © 2026 SentinelIAM. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
