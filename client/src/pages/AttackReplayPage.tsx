/*
 * AttackReplayPage — HERO feature: animated attack flow reconstruction
 * Design: Obsidian Command SOC aesthetic — cinematic threat path visualization
 * Empty state: Shows mesh network node layout with threat path preview before replay starts
 * Replay: Each step animates sequentially with pulse rings, glowing edges, and decision gates
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Shield,
  ScanSearch,
  Zap,
  Lock,
  Ban,
  CheckCircle2,
  Play,
  RotateCcw,
  User,
  Bot,
  ShieldCheck,
  AlertTriangle,
  BarChart3,
  FileText,
  ChevronRight,
  ShieldX,
  Eye,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const replaySteps = [
  {
    id: "developer",
    label: "Developer",
    sub: "Initiates prompt",
    icon: User,
    color: "#00D4AA",
    description: "Developer sends a prompt to the AI agent asking to analyze a GitHub repository.",
    status: "completed" as const,
  },
  {
    id: "agent",
    label: "AI Agent",
    sub: "CodeAgent-03 processes request",
    icon: Bot,
    color: "#00D4AA",
    description: "CodeAgent-03 processes the prompt and prepares to interact with GitHub MCP server.",
    status: "completed" as const,
  },
  {
    id: "guardianmesh",
    label: "GuardianMesh",
    sub: "Intercepts interaction at MCP gateway",
    icon: ShieldCheck,
    color: "#00D4AA",
    description: "GuardianMesh intercepts the MCP request before it reaches the server.",
    status: "completed" as const,
  },
  {
    id: "threat-detection",
    label: "Threat Detection",
    sub: "Role hijacking via markdown payload",
    icon: ScanSearch,
    color: "#EF4444",
    description: "Prompt injection signature detected — role hijacking via markdown payload.",
    status: "alert" as const,
  },
  {
    id: "risk-engine",
    label: "Risk Engine",
    sub: "Risk score: 34/100 — Critical",
    icon: BarChart3,
    color: "#F59E0B",
    description: "Risk score: 34/100 (Critical). Multiple high-severity indicators matched.",
    status: "alert" as const,
  },
  {
    id: "policy-engine",
    label: "Policy Engine",
    sub: "3 policy violations triggered",
    icon: Lock,
    color: "#F59E0B",
    description: "3 policy violations triggered: POL-001, POL-003, POL-007.",
    status: "alert" as const,
  },
  {
    id: "decision",
    label: "BLOCKED",
    sub: "Request denied at mesh gateway",
    icon: ShieldX,
    color: "#EF4444",
    description: "BLOCKED — Request denied. Agent notified of policy violation. SOC alert dispatched.",
    status: "blocked" as const,
  },
];

/* ── Empty state mesh visualization ── */
function MeshNodeLayout() {
  const nodes = [
    { x: 50, y: 10, label: "DEV", color: "#00D4AA" },
    { x: 50, y: 28, label: "AGENT", color: "#00D4AA" },
    { x: 50, y: 46, label: "MESH", color: "#00D4AA" },
    { x: 50, y: 64, label: "DETECT", color: "#00D4AA" },
    { x: 50, y: 82, label: "RISK", color: "#00D4AA" },
    { x: 50, y: 94, label: "BLOCK", color: "#00D4AA" },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 200 400" className="w-full h-full max-w-[260px] opacity-60">
        {/* Connection lines */}
        {nodes.slice(0, -1).map((node, i) => (
          <line
            key={`line-${i}`}
            x1="100"
            y1={node.y * 4}
            x2="100"
            y2={nodes[i + 1].y * 4}
            stroke={node.color}
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.3"
          />
        ))}
        {/* Pulse rings on each node */}
        {nodes.map((node, i) => (
          <g key={node.label}>
            <circle cx="100" cy={node.y * 4} r="12" fill="none" stroke={node.color} strokeWidth="1" opacity="0.3">
              <animate attributeName="r" values="12;20;12" dur="3s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy={node.y * 4} r="12" fill="none" stroke={node.color} strokeWidth="1.5" opacity="0.6" />
            <circle cx="100" cy={node.y * 4} r="4" fill={node.color} opacity="0.8" />
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function AttackReplayPage() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const playReplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(true);
    setCurrentStep(-1);

    let step = 0;
    // Start after a brief pause
    setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setCurrentStep(step);
        step++;
        if (step >= replaySteps.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsPlaying(false);
        }
      }, 1800);
    }, 500);
  }, []);

  const resetReplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentStep(-1);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const showFlow = currentStep >= 0;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Attack Replay</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Step-by-step visual reconstruction of detected threat THR-2026-0717-003
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={playReplay}
            disabled={isPlaying}
            className="bg-teal text-background hover:bg-teal/90"
          >
            {isPlaying ? (
              <>
                <Zap size={16} className="mr-2 animate-pulse" />
                Replaying...
              </>
            ) : (
              <>
                <Play size={16} className="mr-2" />
                Replay Attack
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={resetReplay}
            className="border-border/50"
          >
            <RotateCcw size={16} className="mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Main visualization area */}
      <Card className="bg-card/60 border-border/50">
        <CardContent className="p-6 md:p-10">
          <AnimatePresence mode="wait">
            {!showFlow ? (
              /* ── Empty state: mesh node layout + threat preview ── */
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col lg:flex-row items-center gap-8"
              >
                {/* Left: mesh visualization */}
                <div className="w-full lg:w-1/2 h-[360px] relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MeshNodeLayout />
                  </div>
                  {/* Overlay info badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <Badge variant="outline" className="text-[10px] border-teal/30 text-teal bg-teal/5">
                      <Radio size={10} className="mr-1 animate-pulse" /> 7 stages mapped
                    </Badge>
                    <Badge variant="outline" className="text-[10px] border-crimson/30 text-crimson bg-crimson/5">
                      <AlertTriangle size={10} className="mr-1" /> 3 threats intercepted
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 right-4 text-right">
                    <p className="text-[10px] text-muted-foreground font-mono">THR-2026-0717-003</p>
                    <p className="text-xs text-foreground font-semibold">Role Hijacking</p>
                    <p className="text-[10px] text-crimson font-mono">Blocked at MCP Gateway</p>
                  </div>
                </div>

                {/* Right: threat intel summary */}
                <div className="w-full lg:w-1/2 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-crimson/10 flex items-center justify-center">
                      <ShieldAlert size={20} className="text-crimson" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Threat Detected</p>
                      <p className="text-xs text-muted-foreground">7/17/2026, 2:32 PM — GitHub MCP</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "Injection Type", value: "Role Hijacking", color: "text-crimson" },
                      { label: "Method", value: "Markdown Injection", color: "text-amber" },
                      { label: "Target Agent", value: "CodeAgent-03", color: "text-foreground" },
                      { label: "Confidence", value: "97.3%", color: "text-crimson" },
                      { label: "Resolution", value: "BLOCKED", color: "text-crimson" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-border/30">
                        <span className="text-xs text-muted-foreground">{item.label}</span>
                        <span className={`text-xs font-mono font-medium ${item.color}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/50">
                    <p className="text-[11px] text-muted-foreground mb-2">What happened:</p>
                    <p className="text-xs text-foreground/80 leading-relaxed">
                      CodeAgent-03 received a prompt containing <span className="text-crimson font-medium">role hijacking instructions</span> via markdown payload. GuardianMesh intercepted the request at the MCP gateway, identified <span className="text-amber font-medium">3 policy violations</span>, and blocked the request before it reached the GitHub server.
                    </p>
                  </div>

                  <Button
                    onClick={playReplay}
                    size="sm"
                    className="bg-teal text-background hover:bg-teal/90 mt-2"
                  >
                    <Play size={14} className="mr-2" />
                    Replay Attack
                    <ChevronRight size={14} className="ml-1" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              /* ── Replay flow visualization ── */
              <motion.div
                key="replay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                {replaySteps.map((step, i) => {
                  const isVisible = currentStep >= i;
                  const isActive = currentStep === i;
                  const Icon = step.icon;

                  return (
                    <div key={step.id} className="flex flex-col items-center w-full">
                      {/* Step node */}
                      <AnimatePresence>
                        {isVisible && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.85, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            className={`w-full max-w-lg p-4 rounded-xl border transition-all duration-500 ${
                              step.status === "alert" || step.status === "blocked"
                                ? "bg-crimson/5 border-crimson/20"
                                : "bg-teal/5 border-teal/20"
                            } ${isActive ? "ring-1 ring-offset-0 ring-teal/30" : ""}`}
                            style={isActive ? { boxShadow: `0 0 40px ${step.color}20` } : {}}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${step.color}15` }}
                              >
                                <Icon size={22} style={{ color: step.color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <h3 className="font-display font-semibold text-sm text-foreground">
                                    {step.label}
                                  </h3>
                                  {step.status === "alert" && (
                                    <AlertTriangle size={14} className="text-crimson" />
                                  )}
                                  {step.status === "blocked" && (
                                    <ShieldX size={14} className="text-crimson" />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground font-mono">{step.sub}</p>
                              </div>
                              {isActive && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-2.5 h-2.5 rounded-full animate-pulse"
                                  style={{ backgroundColor: step.color }}
                                />
                              )}
                            </div>
                            <AnimatePresence>
                              {isActive && (
                                <motion.p
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3, delay: 0.15 }}
                                  className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border/30"
                                >
                                  {step.description}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Connector arrow */}
                      {i < replaySteps.length - 1 && currentStep >= i && (
                        <motion.div
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center justify-center py-1.5"
                        >
                          <div className={`w-px h-6 ${
                            step.status === "alert" || step.status === "blocked"
                              ? "bg-crimson/40"
                              : "bg-teal/40"
                          }`} />
                        </motion.div>
                      )}
                      {i < replaySteps.length - 1 && currentStep < i && (
                        <div className="flex items-center justify-center py-1.5">
                          <div className="w-px h-6 bg-muted/50" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress indicator */}
          {showFlow && (
            <div className="mt-8 pt-6 border-t border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">
                  Step {Math.max(0, currentStep + 1)} of {replaySteps.length}
                </span>
                <div className="flex gap-1">
                  {replaySteps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentStep >= i ? "w-6 bg-teal" : "w-3 bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Replay details */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card className="bg-card/60 border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert size={16} className="text-crimson" />
              <h4 className="text-sm font-semibold text-foreground">Attack Summary</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Type</span>
                <span className="text-foreground font-medium">Role Hijacking</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Method</span>
                <span className="text-foreground font-medium">Markdown Injection</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Confidence</span>
                <span className="text-crimson font-mono font-semibold">97.3%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Duration</span>
                <span className="text-foreground font-mono">667ms</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/60 border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-teal" />
              <h4 className="text-sm font-semibold text-foreground">Defense Actions</h4>
            </div>
            <div className="space-y-2">
              {["Intercepted at MCP gateway", "Signature matched in 0.22s", "Risk score: Critical", "Request blocked", "Alert sent to SOC"].map((action, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 size={12} className="text-teal shrink-0" />
                  <span className="text-foreground">{action}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/60 border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} className="text-teal" />
              <h4 className="text-sm font-semibold text-foreground">Incident Metadata</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Incident ID</span>
                <span className="text-foreground font-mono">THR-003</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">MCP Server</span>
                <span className="text-foreground">GitHub</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">AI Agent</span>
                <span className="text-foreground font-mono">CodeAgent-03</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Resolution</span>
                <Badge className="text-[10px] bg-crimson/20 text-crimson border-crimson/30">Blocked</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
