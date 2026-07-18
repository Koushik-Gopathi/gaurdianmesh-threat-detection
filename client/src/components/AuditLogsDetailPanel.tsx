/*
 * AuditLogsDetailPanel — Slide-out panel showing full JSON payload
 * Opens when clicking an audit log row
 */
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface AuditLogEntry {
  id: number;
  time: string;
  decision: "allowed" | "blocked" | "warning";
  threatType: string | null;
  riskLevel: "low" | "medium" | "high" | "critical";
  mcpServer: string;
  agent: string;
  details: string;
}

interface AuditLogsDetailPanelProps {
  isOpen: boolean;
  entry: AuditLogEntry | null;
  onClose: () => void;
}

export default function AuditLogsDetailPanel({ isOpen, entry, onClose }: AuditLogsDetailPanelProps) {
  if (!entry) return null;

  const jsonPayload = {
    id: entry.id,
    timestamp: entry.time,
    decision: entry.decision,
    threat: {
      type: entry.threatType,
      riskLevel: entry.riskLevel,
      confidence: Math.floor(Math.random() * 40) + 60,
      details: entry.details,
    },
    mcp: {
      server: entry.mcpServer,
      agent: entry.agent,
      interaction: {
        method: "POST",
        endpoint: `/api/mcp/${entry.mcpServer.toLowerCase().replace(" ", "-")}/execute`,
      },
    },
    policy: {
      violated: entry.decision === "blocked",
      policies: entry.threatType ? [
        {
          id: "POL-001",
          name: "No System Prompt Modification",
          severity: "critical",
        },
        {
          id: "POL-003",
          name: "No Unauthorized Tool Access",
          severity: "high",
        },
      ] : [],
    },
    action: {
      taken: entry.decision === "blocked" ? "BLOCKED" : entry.decision === "warning" ? "FLAGGED" : "ALLOWED",
      timestamp: entry.time,
      reason: entry.details,
    },
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonPayload, null, 2));
    toast.success("JSON copied to clipboard");
  };

  const handleDownloadJSON = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(jsonPayload, null, 2)], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = `audit-log-${entry.id}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("JSON downloaded");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-background border-l border-border/50 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border/50 p-6 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">Audit Log Details</h2>
                <p className="text-xs text-muted-foreground mt-1">Entry ID: {entry.id}</p>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Quick Summary */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Summary</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-background/50 border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">Decision</p>
                    <Badge
                      className={`text-[10px] ${
                        entry.decision === "allowed"
                          ? "bg-teal/20 text-teal border-teal/30"
                          : entry.decision === "blocked"
                          ? "bg-crimson/20 text-crimson border-crimson/30"
                          : "bg-amber/20 text-amber border-amber/30"
                      }`}
                    >
                      {entry.decision.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50 border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                    <Badge
                      className={`text-[10px] ${
                        entry.riskLevel === "critical"
                          ? "bg-crimson/20 text-crimson border-crimson/30"
                          : entry.riskLevel === "high"
                          ? "bg-amber/20 text-amber border-amber/30"
                          : entry.riskLevel === "medium"
                          ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                          : "bg-teal/20 text-teal border-teal/30"
                      }`}
                    >
                      {entry.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50 border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">Server</p>
                    <p className="text-xs font-mono text-foreground">{entry.mcpServer}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50 border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">Agent</p>
                    <p className="text-xs font-mono text-foreground">{entry.agent}</p>
                  </div>
                </div>
              </div>

              {/* Threat Details */}
              {entry.threatType && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Threat Details</h3>
                  <div className="p-4 rounded-lg bg-background/50 border border-border/30 space-y-2">
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="text-sm font-medium text-foreground">{entry.threatType}</p>
                    <p className="text-xs text-muted-foreground mt-3">Description</p>
                    <p className="text-sm text-foreground">{entry.details}</p>
                  </div>
                </div>
              )}

              {/* Full JSON Payload */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">JSON Payload</h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border/50 text-xs"
                      onClick={handleCopyJSON}
                    >
                      <Copy size={12} className="mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border/50 text-xs"
                      onClick={handleDownloadJSON}
                    >
                      <Download size={12} className="mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border/30 overflow-x-auto">
                  <pre className="text-[11px] font-mono text-muted-foreground whitespace-pre-wrap break-words">
                    {JSON.stringify(jsonPayload, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Metadata</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-background/50 border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">Timestamp</p>
                    <p className="text-xs font-mono text-foreground">{entry.time}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50 border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">Entry ID</p>
                    <p className="text-xs font-mono text-foreground">#{entry.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
