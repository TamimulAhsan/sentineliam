import { motion } from "framer-motion";
import { Cloud, GitBranch, ShieldCheck, Zap } from "lucide-react";

const features = [
  {
    icon: Cloud,
    title: "Multi-Cloud Sync",
    description: "Connect AWS, Azure, and GCP in minutes. Real-time synchronization keeps your security posture updated across all platforms.",
    gradient: "from-cyan-500/20 to-blue-500/20",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
  },
  {
    icon: GitBranch,
    title: "Visual Relationship Mapping",
    description: "Interactive graphs reveal hidden connections between users, roles, and resources. Understand your permission landscape at a glance.",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
  },
  {
    icon: ShieldCheck,
    title: "Automated Policy Auditing",
    description: "AI-powered analysis detects overprivileged accounts, unused permissions, and compliance violations automatically.",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
  },
  {
    icon: Zap,
    title: "One-Click Remediation",
    description: "Generate least-privilege policies and apply fixes directly to your cloud environments with intelligent automation.",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Features = () => {
  return (
    <section className="py-24 relative">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Enterprise Security, <span className="gradient-text">Simplified</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to secure and optimize your cloud IAM infrastructure in one unified platform.
          </p>
        </motion.div>
        
        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className={`glass-card-hover p-8 ${index === 0 ? 'md:row-span-1' : ''}`}
            >
              <div className={`inline-flex p-3 rounded-xl ${feature.iconBg} mb-6`}>
                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
              
              {/* Decorative gradient */}
              <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl ${feature.gradient} rounded-full blur-3xl opacity-50`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
