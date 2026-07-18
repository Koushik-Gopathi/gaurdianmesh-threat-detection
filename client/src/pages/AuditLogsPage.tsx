/*
 * AuditLogsPage — Searchable audit log with filtering and export
 * Table: Time, Decision, Threat Type, Risk Level, MCP Server, Agent, Details
 * Filters: Risk Level, Decision Type
 * Export: CSV, PDF
 */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Search,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

/* ── Mock audit log data ── */
const auditLogs = [
  { id: 1, time: "2026-07-18 14:32:01", decision: "blocked", threatType: "Prompt Injection", riskLevel: "critical", mcpServer: "GitHub MCP", agent: "CodeAgent-03", details: "Role hijacking via markdown payload" },
  { id: 2, time: "2026-07-18 14:31:44", decision: "allowed", threatType: null, riskLevel: "low", mcpServer: "Gmail MCP", agent: "MailBot-01", details: "Routine email retrieval" },
  { id: 3, time: "2026-07-18 14:31:22", decision: "blocked", threatType: "SQL Injection", riskLevel: "critical", mcpServer: "Database MCP", agent: "QueryBot-02", details: "SQL injection in prompt" },
  { id: 4, time: "2026-07-18 14:30:58", decision: "allowed", threatType: null, riskLevel: "low", mcpServer: "Slack MCP", agent: "NotifyAgent", details: "Message posting" },
  { id: 5, time: "2026-07-18 14:30:31", decision: "blocked", threatType: "Unauthorized Access", riskLevel: "high", mcpServer: "Filesystem MCP", agent: "FileAgent-07", details: "Attempted access to system files" },
  { id: 6, time: "2026-07-18 14:30:15", decision: "allowed", threatType: null, riskLevel: "low", mcpServer: "GitHub MCP", agent: "CodeAgent-01", details: "Repository read operation" },
  { id: 7, time: "2026-07-18 14:29:48", decision: "warning", threatType: "Suspicious Pattern", riskLevel: "medium", mcpServer: "Database MCP", agent: "QueryBot-01", details: "Unusual query pattern detected" },
  { id: 8, time: "2026-07-18 14:29:20", decision: "allowed", threatType: null, riskLevel: "low", mcpServer: "Gmail MCP", agent: "MailBot-02", details: "Email send operation" },
  { id: 9, time: "2026-07-18 14:28:55", decision: "blocked", threatType: "Policy Violation", riskLevel: "high", mcpServer: "Slack MCP", agent: "BotAgent-05", details: "Attempted to post in restricted channel" },
  { id: 10, time: "2026-07-18 14:28:30", decision: "allowed", threatType: null, riskLevel: "low", mcpServer: "Filesystem MCP", agent: "FileAgent-03", details: "Document read" },
  { id: 11, time: "2026-07-18 14:28:01", decision: "blocked", threatType: "Data Exfiltration", riskLevel: "critical", mcpServer: "Database MCP", agent: "QueryBot-03", details: "Attempted bulk data extraction" },
  { id: 12, time: "2026-07-18 14:27:40", decision: "allowed", threatType: null, riskLevel: "low", mcpServer: "GitHub MCP", agent: "CodeAgent-02", details: "Issue comment creation" },
];

const ITEMS_PER_PAGE = 8;

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [decisionFilter, setDecisionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        log.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.mcpServer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRisk =
        riskFilter === "all" || log.riskLevel === riskFilter;

      const matchesDecision =
        decisionFilter === "all" || log.decision === decisionFilter;

      return matchesSearch && matchesRisk && matchesDecision;
    });
  }, [searchTerm, riskFilter, decisionFilter]);

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleExport = (format: "csv" | "pdf") => {
    toast.success(`Exporting ${format.toUpperCase()}...`);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredLogs.length} total events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-border/50 text-sm"
            onClick={() => handleExport("csv")}
          >
            <Download size={14} className="mr-1" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-border/50 text-sm"
            onClick={() => handleExport("pdf")}
          >
            <Download size={14} className="mr-1" />
            PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 space-y-4"
      >
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by agent, server, or details..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 bg-background/50 border-border/50"
              />
            </div>
          </div>
          <Select value={riskFilter} onValueChange={(v) => { setRiskFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-full md:w-48 bg-background/50 border-border/50">
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <Select value={decisionFilter} onValueChange={(v) => { setDecisionFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-full md:w-48 bg-background/50 border-border/50">
              <SelectValue placeholder="Decision" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Decisions</SelectItem>
              <SelectItem value="allowed">Allowed</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Logs table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-card/60 border-border/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-background/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Decision</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Threat Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Server</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Agent</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map((log) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="border-b border-border/30 hover:bg-accent/20 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{log.time}</td>
                      <td className="px-4 py-3">
                        {log.decision === "allowed" ? (
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-teal" />
                            <span className="text-xs font-medium text-teal">Allowed</span>
                          </div>
                        ) : log.decision === "blocked" ? (
                          <div className="flex items-center gap-1.5">
                            <XCircle size={14} className="text-crimson" />
                            <span className="text-xs font-medium text-crimson">Blocked</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle size={14} className="text-amber" />
                            <span className="text-xs font-medium text-amber">Warning</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-foreground">
                        {log.threatType ? (
                          <Badge variant="outline" className="text-[10px] border-border/50">
                            {log.threatType}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={`text-[10px] ${
                            log.riskLevel === "critical" ? "bg-crimson/20 text-crimson border-crimson/30" :
                            log.riskLevel === "high" ? "bg-amber/20 text-amber border-amber/30" :
                            log.riskLevel === "medium" ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" :
                            "bg-teal/20 text-teal border-teal/30"
                          }`}
                        >
                          {log.riskLevel}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-foreground font-mono">{log.mcpServer}</td>
                      <td className="px-4 py-3 text-xs text-foreground font-mono">{log.agent}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{log.details}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mt-4 flex items-center justify-between"
      >
        <p className="text-xs text-muted-foreground">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)} of {filteredLogs.length}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-border/50"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={14} />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                  page === currentPage
                    ? "bg-teal text-background"
                    : "hover:bg-accent/50 text-foreground"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-border/50"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
