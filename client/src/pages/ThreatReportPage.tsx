/*
 * ThreatReportPage — Detailed threat analysis report
 * Risk Meter, Threat Level, Type, Confidence, Policy Violations,
 * Suspicious Instructions, Prompt Injection, Recommended Action,
 * Explainability Section, Timeline
 */
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  Ban,
  CheckCircle2,
  Shield,
  FileText,
  Clock,
  ChevronRight,
  ArrowRight,
  Zap,
  Lock,
  Eye,
  Code2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ThreatAnalysis, ThreatCategory } from "../threatEngine";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

function RiskMeter({ score }: { score: number }) {
  const getColor = () => {
    if (score <= 20) return "#00D4AA";
    if (score <= 50) return "#F59E0B";
    if (score <= 70) return "#F97316";
    return "#EF4444";
  };

  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
        <circle
          cx="80"
          cy="80"
          r="70"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted"
        />
        <motion.circle
          cx="80"
          cy="80"
          r="70"
          fill="none"
          stroke={getColor()}
          strokeWidth="8"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-foreground">{score}</span>
        <span className="text-xs text-muted-foreground">Risk Score</span>
      </div>
    </div>
  );
}

export default function ThreatReportPage() {
  const [, setLocation] = useLocation();
  const [threatReport, setThreatReport] = useState<ThreatAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve analysis results from sessionStorage
    const storedAnalysis = sessionStorage.getItem('currentThreatAnalysis');
    if (storedAnalysis) {
      try {
        const analysis = JSON.parse(storedAnalysis);
        setThreatReport(analysis);
      } catch (error) {
        console.error("Failed to parse threat analysis:", error);
        toast.error("Failed to load threat report");
        setLocation("/analyze");
      }
    } else {
      // No analysis results found, redirect back to analyze page
      toast.error("No analysis results found. Please analyze an interaction first.");
      setLocation("/analyze");
    }
    setLoading(false);
  }, [setLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-teal" size={32} />
      </div>
    );
  }

  if (!threatReport) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="bg-card/60 border-border/50">
          <CardContent className="p-8 text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-amber" />
            <h3 className="font-display text-xl font-bold text-foreground mb-2">No Report Available</h3>
            <p className="text-muted-foreground mb-6">
              Please analyze an interaction first to view the threat report.
            </p>
            <Button onClick={() => setLocation("/analyze")} className="bg-teal text-background hover:bg-teal/90">
              Go to Analyze <ArrowRight size={16} className="ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div {...fadeUp} className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Threat Analysis Report</h1>
        <p className="text-muted-foreground">
          Detailed security assessment and recommendations for the analyzed MCP interaction
        </p>
      </motion.div>

      {/* Risk Overview */}
      <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Meter */}
        <Card className="bg-card/60 border-border/50 md:col-span-1">
          <CardContent className="p-8 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <RiskMeter score={threatReport.riskScore} />
            </div>
          </CardContent>
        </Card>

        {/* Status & Metrics */}
        <Card className="bg-card/60 border-border/50 md:col-span-2">
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Status</p>
              <div className="flex items-center gap-3">
                {threatReport.status === "HIGH RISK" ? (
                  <>
                    <span className="text-3xl">🔴</span>
                    <span className="font-display text-2xl font-bold text-red-500">{threatReport.status}</span>
                  </>
                ) : threatReport.status === "MEDIUM RISK" ? (
                  <>
                    <span className="text-3xl">🟠</span>
                    <span className="font-display text-2xl font-bold text-orange-500">{threatReport.status}</span>
                  </>
                ) : threatReport.status === "LOW RISK" ? (
                  <>
                    <span className="text-3xl">🟡</span>
                    <span className="font-display text-2xl font-bold text-yellow-500">{threatReport.status}</span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl">🟢</span>
                    <span className="font-display text-2xl font-bold text-teal">{threatReport.status}</span>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/30">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Confidence</p>
                <p className="text-xl font-bold text-foreground">{threatReport.confidence}%</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Threats Found</p>
                <p className="text-xl font-bold text-foreground">{threatReport.detectedThreats.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Analysis Details */}
      <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category & Explanation */}
        <Card className="bg-card/60 border-border/50">
          <CardHeader className="border-b border-border/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <Code2 size={20} className="text-teal" />
              Threat Category
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Badge className="mb-4 bg-teal/20 text-teal border-teal/30">{threatReport.category}</Badge>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {threatReport.explanation}
            </p>
          </CardContent>
        </Card>

        {/* Recommendation */}
        <Card className="bg-card/60 border-border/50">
          <CardHeader className="border-b border-border/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap size={20} className="text-amber" />
              Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {threatReport.recommendation}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detected Threats */}
      {threatReport.detectedThreats.length > 0 && (
        <motion.div {...fadeUp}>
          <Card className="bg-card/60 border-border/50">
            <CardHeader className="border-b border-border/30">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldAlert size={20} className="text-amber" />
                Detected Threats ({threatReport.detectedThreats.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {threatReport.detectedThreats.map((threat: string, i: number) => (
                  <Badge key={i} variant="outline" className="text-[10px] border-amber/30 text-amber">
                    {threat}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Policy Violations */}
      <motion.div {...fadeUp}>
        <Card className="bg-card/60 border-border/50">
          <CardHeader className="border-b border-border/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock size={20} className="text-crimson" />
              Policy Violations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {threatReport.riskScore > 40 ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Ban size={16} className="text-crimson mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">Suspicious Pattern Detected</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      The interaction contains patterns that may violate security policies.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-teal">
                <CheckCircle2 size={16} />
                <p className="text-sm">No policy violations detected</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div {...fadeUp} className="flex gap-3 justify-end">
        <Button
          variant="outline"
          onClick={() => setLocation("/analyze")}
          className="border-border/50"
        >
          Analyze Another
        </Button>
        <Button
          onClick={() => setLocation("/dashboard")}
          className="bg-teal text-background hover:bg-teal/90"
        >
          Back to Dashboard <ArrowRight size={16} className="ml-2" />
        </Button>
      </motion.div>
    </div>
  );
}
