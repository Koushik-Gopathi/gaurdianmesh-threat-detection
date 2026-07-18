/*
 * SettingsPage — App settings with tabs
 * Tabs: MCP Servers, API Keys, Notifications, Profile, Security Policies
 */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Server,
  Key,
  Bell,
  User,
  Shield,
  Plus,
  Trash2,
  Edit3,
  ToggleLeft,
  ToggleRight,
  Code2,
  Mail,
  Database,
  Folder,
  MessageSquare,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Palette,
  Globe,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";

const tabs = [
  { id: "servers", label: "MCP Servers", icon: Server },
  { id: "api", label: "API Keys", icon: Key },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "profile", label: "Profile", icon: User },
  { id: "policies", label: "Security Policies", icon: Shield },
];

const connectedServers = [
  { id: "github", label: "GitHub MCP", icon: Code2, status: "connected", requests: "1,247" },
  { id: "gmail", label: "Gmail MCP", icon: Mail, status: "connected", requests: "832" },
  { id: "database", label: "Database MCP", icon: Database, status: "connected", requests: "567" },
  { id: "filesystem", label: "Filesystem MCP", icon: Folder, status: "connected", requests: "312" },
  { id: "slack", label: "Slack MCP", icon: MessageSquare, status: "connected", requests: "198" },
];

const mockApiKeys = [
  { id: "gm-api-001", name: "Production", key: "gm_live_k8j2h...x9f3", created: "2026-07-01", usage: "12.4K requests" },
  { id: "gm-api-002", name: "Development", key: "gm_dev_m4n7p...q2w8", created: "2026-07-10", usage: "3.2K requests" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("servers");
  const [showKeys, setShowKeys] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your GuardianMesh configuration</p>
      </div>

      {/* Tab navigation */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-teal/10 text-teal border border-teal/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/30 border border-transparent"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* MCP Servers */}
        {activeTab === "servers" && (
          <div className="space-y-4">
            <Card className="bg-card/60 border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-foreground">Connected MCP Servers</CardTitle>
                  <Button size="sm" className="bg-teal text-background hover:bg-teal/90 text-xs">
                    <Plus size={14} className="mr-1.5" /> Add Server
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {connectedServers.map((server) => {
                  const Icon = server.icon;
                  return (
                    <div key={server.id} className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/30">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center">
                          <Icon size={18} className="text-teal" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{server.label}</p>
                          <p className="text-xs text-muted-foreground">{server.requests} requests monitored</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="text-[10px] bg-teal/20 text-teal border-teal/30">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal mr-1.5" />
                          Connected
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        )}

        {/* API Keys */}
        {activeTab === "api" && (
          <div className="space-y-4">
            <Card className="bg-card/60 border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-foreground">API Keys</CardTitle>
                  <Button size="sm" className="bg-teal text-background hover:bg-teal/90 text-xs">
                    <Plus size={14} className="mr-1.5" /> Generate Key
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockApiKeys.map((key) => (
                  <div key={key.id} className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/30">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Key size={18} className="text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{key.name}</p>
                        <p className="text-xs font-mono text-muted-foreground">
                          {showKeys ? key.key : key.key.replace(/gm_.*\.\.\./, "gm_••••••••...")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground mr-2">{key.usage}</span>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground" onClick={() => toast.success("Key copied!")}>
                        <Copy size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setShowKeys(!showKeys)}
                    className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground"
                  >
                    {showKeys ? <EyeOff size={13} /> : <Eye size={13} />}
                    {showKeys ? "Hide" : "Show"} keys
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <Card className="bg-card/60 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-foreground">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Critical threat alerts", desc: "Immediate notification for blocked threats", enabled: true },
                { label: "Daily summary", desc: "Receive daily digest of all MCP activity", enabled: true },
                { label: "Policy violation alerts", desc: "Alert when agents violate security policies", enabled: true },
                { label: "New server connection", desc: "Notify when new MCP servers are connected", enabled: false },
                { label: "Weekly report", desc: "Comprehensive weekly security report", enabled: true },
                { label: "System health alerts", desc: "Alert on infrastructure issues", enabled: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/30">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch checked={item.enabled} onCheckedChange={() => toast.info("Preference updated")} />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Profile */}
        {activeTab === "profile" && (
          <div className="space-y-4">
            <Card className="bg-card/60 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground">Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-background/30 border border-border/30">
                  <div className="w-14 h-14 rounded-full bg-teal/20 flex items-center justify-center text-teal font-bold text-lg">
                    GM
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Security Admin</p>
                    <p className="text-xs text-muted-foreground">admin@guardianmesh.ai</p>
                    <p className="text-xs text-muted-foreground mt-1">Enterprise Plan — 12 MCP servers</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto border-border/50">
                    <Edit3 size={14} className="mr-1.5" /> Edit
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Full Name</label>
                    <Input defaultValue="Security Admin" className="bg-background/50 border-border/50 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Email</label>
                    <Input defaultValue="admin@guardianmesh.ai" className="bg-background/50 border-border/50 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Organization</label>
                    <Input defaultValue="GuardianMesh Corp" className="bg-background/50 border-border/50 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Role</label>
                    <Input defaultValue="Security Engineer" className="bg-background/50 border-border/50 text-sm" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Palette size={16} className="text-teal" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/30">
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? <Moon size={18} className="text-teal" /> : <Sun size={18} className="text-teal" />}
                    <div>
                      <p className="text-sm font-medium text-foreground">Theme</p>
                      <p className="text-xs text-muted-foreground">Currently: {theme === "dark" ? "Dark" : "Light"}</p>
                    </div>
                  </div>
                  <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Security Policies */}
        {activeTab === "policies" && (
          <Card className="bg-card/60 border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-foreground">Security Policies</CardTitle>
                <Button size="sm" className="bg-teal text-background hover:bg-teal/90 text-xs">
                  <Plus size={14} className="mr-1.5" /> New Policy
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { id: "POL-001", name: "No system prompt modification", scope: "All MCP servers", enforcement: "Strict", violations: 12 },
                { id: "POL-002", name: "Rate limiting — 100 req/min", scope: "All agents", enforcement: "Enforced", violations: 0 },
                { id: "POL-003", name: "No unauthorized tool access", scope: "All MCP servers", enforcement: "Strict", violations: 7 },
                { id: "POL-004", name: "Data classification check", scope: "Database MCP", enforcement: "Warn", violations: 3 },
                { id: "POL-005", name: "No credential exposure", scope: "All agents", enforcement: "Strict", violations: 0 },
                { id: "POL-006", name: "Prompt sanitization", scope: "All MCP servers", enforcement: "Enforced", violations: 1 },
                { id: "POL-007", name: "Input sanitization required", scope: "Filesystem MCP", enforcement: "Warn", violations: 5 },
              ].map((policy) => (
                <div key={policy.id} className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/30">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-8 rounded-full ${
                      policy.enforcement === "Strict" ? "bg-crimson" :
                      policy.enforcement === "Enforced" ? "bg-teal" :
                      "bg-amber"
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">{policy.id}</span>
                        <span className="text-sm font-medium text-foreground">{policy.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{policy.scope} — {policy.violations} violations</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`text-[10px] ${
                      policy.enforcement === "Strict" ? "border-crimson/30 text-crimson" :
                      policy.enforcement === "Enforced" ? "border-teal/30 text-teal" :
                      "border-amber/30 text-amber"
                    }`}>
                      {policy.enforcement}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground">
                      <Edit3 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
