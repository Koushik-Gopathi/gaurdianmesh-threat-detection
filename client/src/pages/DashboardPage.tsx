/*
 * DashboardPage — SOC-style security dashboard
 * Cards: Threats Today, Blocked/Allowed Requests, Connected MCP Servers, Risk Level, Running Agents
 * Charts: Threat Timeline, Threat Distribution
 * Live Activity Feed, Trust Score, System Health, Recent Activity
 * Style: Teal = safe/active, Amber = warning, Crimson = critical/danger. No decorative blue/purple.
 */
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Ban,
  Server,
  Activity,
  Bot,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Zap,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

/* ── Mock data ── */
const threatTimelineData = [
  { time: "00:00", threats: 2, blocked: 1 },
  { time: "02:00", threats: 1, blocked: 1 },
  { time: "04:00", threats: 4, blocked: 3 },
  { time: "06:00", threats: 3, blocked: 3 },
  { time: "08:00", threats: 7, blocked: 5 },
  { time: "10:00", threats: 5, blocked: 4 },
  { time: "12:00", threats: 12, blocked: 10 },
  { time: "14:00", threats: 8, blocked: 7 },
  { time: "16:00", threats: 6, blocked: 5 },
  { time: "18:00", threats: 9, blocked: 8 },
  { time: "20:00", threats: 3, blocked: 3 },
  { time: "22:00", threats: 5, blocked: 4 },
];

const threatDistributionData = [
  { name: "Prompt Injection", value: 42, color: "#EF4444" },
  { name: "Malicious Tool", value: 23, color: "#F59E0B" },
  { name: "Policy Violation", value: 18, color: "#00D4AA" },
  { name: "Suspicious Access", value: 11, color: "#F59E0B" },
  { name: "Data Exfiltration", value: 6, color: "#EF4444" },
];

const liveFeed = [
  { id: 1, time: "14:32:01", type: "blocked", server: "GitHub MCP", agent: "CodeAgent-03", threat: "Prompt injection attempt", risk: "high" },
  { id: 2, time: "14:31:44", type: "allowed", server: "Gmail MCP", agent: "MailBot-01", threat: null, risk: "low" },
  { id: 3, time: "14:31:22", type: "blocked", server: "Database MCP", agent: "QueryBot-02", threat: "SQL injection in prompt", risk: "critical" },
  { id: 4, time: "14:30:58", type: "allowed", server: "Slack MCP", agent: "NotifyAgent", threat: null, risk: "low" },
  { id: 5, time: "14:30:31", type: "blocked", server: "Filesystem MCP", agent: "FileAgent-07", threat: "Unauthorized file access", risk: "high" },
  { id: 6, time: "14:30:15", type: "allowed", server: "GitHub MCP", agent: "CodeAgent-01", threat: null, risk: "low" },
  { id: 7, time: "14:29:48", type: "warning", server: "Database MCP", agent: "QueryBot-01", threat: "Unusual query pattern", risk: "medium" },
  { id: 8, time: "14:29:20", type: "allowed", server: "Gmail MCP", agent: "MailBot-02", threat: null, risk: "low" },
];

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

const stagger = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06 } },
};

function StatCard({ icon: Icon, label, value, sub, trend, color }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub: string;
  trend?: "up" | "down" | "neutral";
  color: string;
}) {
  return (
    <motion.div {...fadeUp}>
      <Card className="bg-card/60 border-border/50 hover:border-teal/20 transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
              <Icon size={16} className="text-white" />
            </div>
            {trend && (
              <div className={`flex items-center gap-1 text-[11px] font-medium ${
                trend === "up" ? "text-crimson" : trend === "down" ? "text-teal" : "text-muted-foreground"
              }`}>
                {trend === "up" ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {trend === "up" ? "+12%" : trend === "down" ? "-8%" : "0%"}
              </div>
            )}
          </div>
          <p className="text-xl font-display font-bold text-foreground mb-0.5">{value}</p>
          <p className="text-[11px] text-muted-foreground">{sub}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TrustScoreGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="oklch(0.22 0.01 260)" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="40" fill="none"
            stroke={score > 80 ? "#00D4AA" : score > 50 ? "#F59E0B" : "#EF4444"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-display font-bold text-foreground">{score}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Trust Score</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [liveTime, setLiveTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => setLiveTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Security Operations Center</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time monitoring of all MCP interactions</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
          <span className="font-mono">LIVE — {liveTime}</span>
        </div>
      </div>

      {/* Stat cards — teal/amber/crimson only */}
      <motion.div {...stagger} className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-5">
        <StatCard icon={ShieldAlert} label="Threats" value={24} sub="Today" trend="up" color="bg-crimson" />
        <StatCard icon={Ban} label="Blocked" value={18} sub="Requests today" trend="up" color="bg-crimson/70" />
        <StatCard icon={ShieldCheck} label="Allowed" value={142} sub="Safe requests" trend="down" color="bg-teal" />
        <StatCard icon={Server} label="MCP Servers" value={12} sub="Connected" color="bg-teal/60" />
        <StatCard icon={Activity} label="Risk Level" value="Medium" sub="Current status" color="bg-amber" />
        <StatCard icon={Bot} label="AI Agents" value={8} sub="Running" color="bg-teal/60" />
      </motion.div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        {/* Threat Timeline */}
        <motion.div {...fadeUp} className="lg:col-span-2">
          <Card className="bg-card/60 border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Activity size={16} className="text-teal" />
                Threat Timeline — Last 24h
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={threatTimelineData}>
                  <defs>
                    <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="blockedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00D4AA" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#00D4AA" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" />
                  <XAxis dataKey="time" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.17 0.01 260)",
                      border: "1px solid oklch(1 0 0 / 10%)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area type="monotone" dataKey="threats" stroke="#EF4444" fill="url(#threatGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="blocked" stroke="#00D4AA" fill="url(#blockedGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-6 mt-3 text-xs">
                <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-crimson rounded" /> Threats Detected</div>
                <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-teal rounded" /> Blocked</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Threat Distribution + Trust Score */}
        <motion.div {...fadeUp} className="space-y-5">
          <Card className="bg-card/60 border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-foreground">Threat Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={threatDistributionData} innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                    {threatDistributionData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.17 0.01 260)",
                      border: "1px solid oklch(1 0 0 / 10%)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {threatDistributionData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="font-mono text-foreground">{d.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-5">
                <TrustScoreGauge score={94} />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">System Trust</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Overall MCP network trust based on agent behavior and policy compliance.</p>
                  <Badge variant="outline" className="mt-2 text-[10px] border-teal/30 text-teal">Healthy</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Live Feed + System Health */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Live Activity Feed */}
        <motion.div {...fadeUp} className="lg:col-span-2">
          <Card className="bg-card/60 border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Zap size={16} className="text-teal" />
                  Live Activity Feed
                </CardTitle>
                <Badge variant="outline" className="text-xs border-teal/30 text-teal">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse mr-1.5 inline-block" />
                  Streaming
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5 max-h-[340px] overflow-y-auto">
                {liveFeed.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/30 transition-colors"
                  >
                    <span className="text-[11px] font-mono text-muted-foreground w-[72px] shrink-0">{event.time}</span>
                    {event.type === "blocked" ? (
                      <XCircle size={14} className="text-crimson shrink-0" />
                    ) : event.type === "warning" ? (
                      <AlertTriangle size={14} className="text-amber shrink-0" />
                    ) : (
                      <CheckCircle2 size={14} className="text-teal shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-foreground truncate">
                        <span className="font-medium">{event.agent}</span>
                        <span className="text-muted-foreground"> → {event.server}</span>
                      </p>
                      {event.threat && (
                        <p className="text-[10px] text-muted-foreground truncate">{event.threat}</p>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] shrink-0 ${
                        event.risk === "critical" ? "border-crimson/30 text-crimson" :
                        event.risk === "high" ? "border-amber/30 text-amber" :
                        event.risk === "medium" ? "border-yellow-500/30 text-yellow-500" :
                        "border-teal/30 text-teal"
                      }`}
                    >
                      {event.risk}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Health */}
        <motion.div {...fadeUp}>
          <Card className="bg-card/60 border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Activity size={16} className="text-teal" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "MCP Shield", status: "Active", ok: true },
                { label: "Threat Detection", status: "Operational", ok: true },
                { label: "Policy Engine", status: "Operational", ok: true },
                { label: "Risk Scoring", status: "Active", ok: true },
                { label: "Audit Logging", status: "Recording", ok: true },
                { label: "API Gateway", status: "99.9% uptime", ok: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.ok ? "bg-teal" : "bg-crimson"}`} />
                    <span className="text-xs text-foreground">{item.label}</span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">{item.status}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-border/50 space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-muted-foreground">CPU</span>
                    <span className="text-[11px] font-mono text-foreground">34%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[34%] rounded-full bg-teal/60" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-muted-foreground">Memory</span>
                    <span className="text-[11px] font-mono text-foreground">67%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[67%] rounded-full bg-amber/60" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
