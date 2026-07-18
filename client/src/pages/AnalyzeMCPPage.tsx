/*
 * AnalyzeMCPPage — MCP interaction analysis
 * Dropdown for MCP server selection, textarea for content/URL, analyze button
 * Scanning animation with progress bar and loading states
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanSearch,
  Shield,
  ShieldAlert,
  Loader2,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Server,
  Code2,
  Globe,
  Mail,
  MessageSquare,
  Database,
  Folder,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { analyzeThreat, ThreatAnalysis, ThreatCategory } from "../threatEngine";

const mcpServers = [
  { id: "github", label: "GitHub", icon: Code2 },
  { id: "gmail", label: "Gmail", icon: Mail },
  { id: "database", label: "Database", icon: Database },
  { id: "filesystem", label: "Filesystem", icon: Folder },
  { id: "slack", label: "Slack", icon: MessageSquare },
];

const scanSteps = [
  { label: "Parsing input data...", icon: Code2 },
  { label: "Identifying MCP protocol patterns...", icon: Globe },
  { label: "Scanning for prompt injections...", icon: ShieldAlert },
  { label: "Analyzing tool call patterns...", icon: Server },
  { label: "Evaluating policy compliance...", icon: Shield },
  { label: "Generating risk score...", icon: Loader2 },
];

export default function AnalyzeMCPPage() {
  const [, setLocation] = useLocation();
  const [selectedServer, setSelectedServer] = useState("");
  const [inputContent, setInputContent] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<ThreatAnalysis | null>(null);

  const handleAnalyze = () => {
    if (!selectedServer) {
      toast.error("Please select an MCP server");
      return;
    }
    if (!inputContent.trim()) {
      toast.error("Please enter interaction content or URL");
      return;
    }

    setAnalyzing(true);
    setScanProgress(0);
    setScanComplete(false);

    // Perform actual analysis
    const results = analyzeThreat(inputContent);
    setAnalysisResults(results);

    // Simulate scanning progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setAnalyzing(false);
          setScanComplete(true);
        }, 500);
      }
      setScanProgress(Math.min(progress, 100));
    }, 300);
  };

  const handleViewReport = () => {
    if (analysisResults) {
      // Store the analysis results in sessionStorage for the report page
      sessionStorage.setItem('currentThreatAnalysis', JSON.stringify(analysisResults));
      // Navigate to threat report page
      setLocation("/threat-report");
    }
  };

  const handleAnalyzeAnother = () => {
    setScanComplete(false);
    setInputContent("");
    setScanProgress(0);
    setAnalysisResults(null);
    setSelectedServer("");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Analyze MCP Interaction</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Paste an MCP interaction, repository URL, or prompt content to scan for threats.
        </p>
      </div>

      {/* Input Section */}
      <AnimatePresence mode="wait">
        {!scanComplete && !analyzing && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <Card className="bg-card/60 border-border/50">
              <CardContent className="p-6 space-y-5">
                {/* Server selection */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                    MCP Server
                  </label>
                  <Select value={selectedServer} onValueChange={setSelectedServer}>
                    <SelectTrigger className="bg-background/50 border-border/50 text-foreground">
                      <SelectValue placeholder="Select MCP server..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/50">
                      {mcpServers.map((server) => (
                        <SelectItem key={server.id} value={server.id}>
                          <div className="flex items-center gap-2">
                            <server.icon size={16} className="text-teal" />
                            <span>{server.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Content input */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                    Interaction Content or Repository URL
                  </label>
                  <textarea
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                    placeholder={`Paste the MCP interaction content, prompt, or URL...\n\nExample: https://github.com/user/repo\nOr paste the raw prompt that was sent to the AI agent...`}
                    className="w-full h-48 px-4 py-3 rounded-lg bg-background/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/50 font-mono resize-none outline-none focus:border-teal/50 focus:ring-1 focus:ring-teal/20 transition-colors"
                  />
                </div>

                {/* Analyze button */}
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleAnalyze}
                    className="bg-teal text-background hover:bg-teal/90 font-semibold px-6"
                  >
                    <ScanSearch size={18} className="mr-2" />
                    Analyze Interaction
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Heuristic engine active — Real-time detection enabled
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Scanning animation */}
        {analyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="bg-card/60 border-border/50">
              <CardContent className="p-8">
                {/* Animated shield icon */}
                <div className="flex flex-col items-center mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Shield size={48} className="text-teal/60" />
                  </motion.div>
                  <h3 className="font-display text-lg font-semibold text-foreground mt-4">
                    Scanning MCP Interaction
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Analyzing content through GuardianMesh security pipeline...
                  </p>
                </div>

                {/* Progress bar */}
                <div className="max-w-md mx-auto">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-muted-foreground font-mono">Progress</span>
                    <span className="font-mono text-teal">{Math.round(scanProgress)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-teal to-cyan-500"
                      animate={{ width: `${scanProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Scan steps */}
                <div className="mt-8 max-w-md mx-auto space-y-3">
                  {scanSteps.map((step, i) => {
                    const stepProgress = (i + 1) * (100 / scanSteps.length);
                    const isActive = scanProgress >= stepProgress - (100 / scanSteps.length);
                    const isComplete = scanProgress >= stepProgress;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                          opacity: isActive ? 1 : 0.3,
                          x: isActive ? 0 : -10,
                        }}
                        className="flex items-center gap-3 text-sm"
                      >
                        {isComplete ? (
                          <CheckCircle2 size={16} className="text-teal shrink-0" />
                        ) : isActive ? (
                          <Loader2 size={16} className="text-teal shrink-0 animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-border/50 shrink-0" />
                        )}
                        <span className={`${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Scan complete */}
        {scanComplete && analysisResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="bg-card/60 border-border/50">
              <CardContent className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    analysisResults.status === "HIGH RISK" ? "bg-red-500/20" : 
                    analysisResults.status === "MEDIUM RISK" ? "bg-orange-500/20" : 
                    analysisResults.status === "LOW RISK" ? "bg-yellow-500/20" : "bg-teal/20"
                  }`}
                >
                  {analysisResults.status === "HIGH RISK" ? (
                    <span className="text-3xl">🔴</span>
                  ) : analysisResults.status === "MEDIUM RISK" ? (
                    <span className="text-3xl">🟠</span>
                  ) : analysisResults.status === "LOW RISK" ? (
                    <span className="text-3xl">🟡</span>
                  ) : (
                    <span className="text-3xl">🟢</span>
                  )}
                </motion.div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {analysisResults.status}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {analysisResults.status === "HIGH RISK" 
                    ? `Analysis found ${analysisResults.detectedThreats.length} critical threat indicators in the MCP interaction.`
                    : analysisResults.status === "MEDIUM RISK"
                    ? `Analysis found ${analysisResults.detectedThreats.length} suspicious patterns in the MCP interaction.`
                    : analysisResults.status === "LOW RISK"
                    ? `Analysis found ${analysisResults.detectedThreats.length} minor concerns that warrant review.`
                    : "GuardianMesh verified this interaction as safe to proceed."
                  }
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
                  <div className="glass-panel rounded-lg p-4">
                    <p className={`text-xl font-display font-bold ${
                      analysisResults.status === "HIGH RISK" ? "text-red-500" : 
                      analysisResults.status === "MEDIUM RISK" ? "text-orange-500" : 
                      analysisResults.status === "LOW RISK" ? "text-yellow-500" : "text-teal"
                    }`}>
                      {analysisResults.riskScore}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">Risk Score</p>
                  </div>
                  <div className="glass-panel rounded-lg p-4">
                    <p className="text-xl font-display font-bold text-foreground">{analysisResults.confidence}%</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">Confidence</p>
                  </div>
                  <div className="glass-panel rounded-lg p-4">
                    <p className="text-[10px] font-display font-bold text-foreground truncate">{analysisResults.category}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">Category</p>
                  </div>
                </div>

                <div className="max-w-md mx-auto mb-8 p-4 rounded-lg bg-background/40 border border-border/30 text-left">
                  <p className="text-xs font-semibold text-foreground mb-1 uppercase tracking-wider">Analysis Summary</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {analysisResults.explanation}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <Button
                    onClick={handleViewReport}
                    className="bg-teal text-background hover:bg-teal/90"
                  >
                    View Full Report <ArrowRight size={16} className="ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleAnalyzeAnother}
                    className="border-border/50"
                  >
                    Analyze Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
