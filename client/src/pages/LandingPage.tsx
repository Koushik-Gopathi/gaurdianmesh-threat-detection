/*
 * LandingPage — GuardianMesh AI public-facing landing
 * Design: Obsidian Command SOC aesthetic
 * Hero: full-viewport with mesh network bg, floating glass panels
 * Sections: Features, Architecture, Stats, CTA, Footer
 */
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Shield,
  ShieldAlert,
  Brain,
  ScanSearch,
  FileText,
  Network,
  ArrowRight,
  ChevronRight,
  Zap,
  Lock,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: ShieldAlert,
    title: "Prompt Injection Detection",
    desc: "Detect and neutralize prompt injection attacks targeting AI agents communicating through MCP servers in real time.",
  },
  {
    icon: Brain,
    title: "AI Risk Scoring",
    desc: "Machine-learning powered risk assessment that scores every interaction and explains the reasoning behind each decision.",
  },
  {
    icon: ScanSearch,
    title: "MCP Server Monitoring",
    desc: "Continuous inspection of all MCP server interactions with real-time threat detection and policy enforcement.",
  },
  {
    icon: Lock,
    title: "Policy Engine",
    desc: "Define and enforce custom security policies. GuardianMesh validates every request against your organizational rules.",
  },
  {
    icon: Eye,
    title: "Explainable Decisions",
    desc: "Every block is accompanied by a detailed explanation. Know exactly why a request was flagged and how to remediate.",
  },
  {
    icon: Network,
    title: "Attack Replay",
    desc: "Step-by-step visual reconstruction of detected attacks. Understand the full threat chain from agent to action.",
  },
];

const stats = [
  { value: "99.7%", label: "Threat Detection Rate", sub: "Across all MCP interactions" },
  { value: "<50ms", label: "Analysis Latency", sub: "Real-time inspection" },
  { value: "10K+", label: "MCP Servers Protected", sub: "Enterprise deployments" },
  { value: "0", label: "False Positives", sub: "Precision-first detection" },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.5 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/manus-storage/guardianmesh_logo_a32bf68d.png" alt="GuardianMesh" className="w-8 h-8" />
            <span className="font-display font-bold text-lg text-foreground">GuardianMesh AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#architecture" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Architecture</a>
            <a href="#stats" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Metrics</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-sm">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="text-sm bg-teal/20 text-teal hover:bg-teal/30 border border-teal/30">
                Launch Dashboard <ChevronRight size={14} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/manus-storage/hero-bg_51658956.png"
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(oklch(0.77 0.14 175) 1px, transparent 1px), linear-gradient(90deg, oklch(0.77 0.14 175) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        {/* Floating glass panels */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-32 right-[10%] hidden lg:block"
        >
          <div className="glass-panel rounded-xl p-4 w-56 glow-teal">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={14} className="text-amber" />
              <span className="text-xs font-mono text-amber">THREAT DETECTED</span>
            </div>
            <p className="text-xs text-muted-foreground font-mono">Prompt injection attempt on GitHub MCP</p>
            <div className="mt-2 flex gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-crimson/20 text-crimson font-mono">BLOCKED</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal/20 text-teal font-mono">0.34s</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-40 left-[8%] hidden lg:block"
        >
          <div className="glass-panel rounded-xl p-4 w-52 glow-teal">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={14} className="text-teal" />
              <span className="text-xs font-mono text-teal">SHIELD ACTIVE</span>
            </div>
            <p className="text-xs text-muted-foreground font-mono">Monitoring 12 MCP servers</p>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "97%" }}
                transition={{ duration: 2, delay: 1 }}
                className="h-full rounded-full bg-gradient-to-r from-teal to-cyan-500"
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 font-mono">97% trust score</p>
          </div>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal/10 border border-teal/20 mb-8">
              <Zap size={14} className="text-teal" />
              <span className="text-sm font-medium text-teal">AI Security Intelligence Platform</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6"
          >
            Protecting AI<br />
            <span className="text-teal">Before It Acts.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            GuardianMesh AI inspects every interaction between AI agents and MCP servers.
            Detect prompt injections, enforce policies, and explain every decision — in real time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard">
              <Button size="lg" className="bg-teal text-background hover:bg-teal/90 text-base px-8 h-12 font-semibold">
                Start Shielding <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href="/replay">
              <Button variant="outline" size="lg" className="border-border/50 text-foreground hover:bg-accent/50 text-base px-8 h-12">
                Watch Attack Replay
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Defense Intelligence for AI Agents
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every layer of protection is designed for the unique threat landscape of autonomous AI systems.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <div className="glass-panel rounded-xl p-6 h-full hover:border-teal/20 transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center mb-4 group-hover:bg-teal/20 transition-colors">
                    <feature.icon size={20} className="text-teal" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" className="relative py-24 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How GuardianMesh Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A transparent pipeline that inspects, analyzes, and decides — before any AI action executes.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            className="relative max-w-4xl mx-auto"
          >
            <div className="glass-panel rounded-2xl p-8 md:p-12">
              {/* Flow diagram */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
                {[
                  { label: "AI Agent", sub: "Initiates request" },
                  { label: "GuardianMesh", sub: "Intercepts" },
                  { label: "Threat Detection", sub: "Analyze" },
                  { label: "Risk Engine", sub: "Score" },
                  { label: "Policy Engine", sub: "Validate" },
                  { label: "Decision", sub: "Allow / Block" },
                ].map((step, i, arr) => (
                  <div key={step.label} className="flex items-center gap-2 md:gap-3">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center mb-1">
                        <span className="text-xs font-mono font-bold text-teal">{i + 1}</span>
                      </div>
                      <p className="text-xs font-semibold text-foreground whitespace-nowrap">{step.label}</p>
                      <p className="text-[10px] text-muted-foreground">{step.sub}</p>
                    </div>
                    {i < arr.length - 1 && (
                      <ChevronRight size={16} className="text-muted-foreground/40 hidden md:block" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border/50">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                  <span className="font-mono">Average inspection time: 34ms per request</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="relative py-24 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Enterprise-Grade Performance
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for zero-trust environments where every interaction must be verified.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass-panel rounded-xl p-6 text-center"
              >
                <p className="font-display text-3xl md:text-4xl font-bold text-teal mb-2">{stat.value}</p>
                <p className="text-sm font-semibold text-foreground">{stat.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-6 border-t border-border/50">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Shield Your AI Agents?
            </h2>
            <p className="text-muted-foreground mb-8">
              Deploy GuardianMesh in minutes. Start protecting your MCP infrastructure today.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-teal text-background hover:bg-teal/90 text-base px-10 h-12 font-semibold">
                Launch Dashboard <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/manus-storage/logo_26f5396c.png" alt="GuardianMesh" className="w-7 h-7 rounded" />
            <span className="font-display font-semibold text-foreground">GuardianMesh AI</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
            <a href="#" className="hover:text-foreground transition-colors">API Reference</a>
            <a href="#" className="hover:text-foreground transition-colors">Security</a>
            <a href="#" className="hover:text-foreground transition-colors">Status</a>
          </div>
          <p className="text-xs text-muted-foreground/60">© 2026 GuardianMesh AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
