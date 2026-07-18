/*
 * DashboardLayout — Persistent sidebar + top navbar for app pages
 * Design: Obsidian Command SOC aesthetic
 * Sidebar: collapsed 64px / expanded 240px, glassmorphic on dark
 * Navbar: search, notifications, profile, theme toggle
 */
import { useState, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  LayoutDashboard,
  ScanSearch,
  RefreshCw,
  FileText,
  ShieldAlert,
  Settings,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  X,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/analyze", label: "Analyze MCP", icon: ScanSearch },
  { path: "/threat-report", label: "Threat Report", icon: ShieldAlert },
  { path: "/replay", label: "Replay", icon: RefreshCw },
  { path: "/logs", label: "Logs", icon: FileText },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen flex flex-col border-r border-border bg-sidebar transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          expanded ? "w-[240px]" : "w-[64px]"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo area */}
        <div className={`flex items-center ${expanded ? "px-4" : "px-3 justify-center"} h-16 border-b border-border`}>
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/manus-storage/guardianmesh_logo_a32bf68d.png"
              alt="GuardianMesh"
              className="w-8 h-8"
            />
            {expanded && (
              <span className="font-display font-bold text-lg tracking-tight whitespace-nowrap text-foreground">
                GuardianMesh
              </span>
            )}
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileOpen(false)}
              >
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isActive
                      ? "rgba(0, 212, 170, 0.08)"
                      : "transparent",
                  }}
                  transition={{ duration: 0.15 }}
                  className={`flex items-center gap-3 ${
                    expanded ? "px-3" : "px-2 justify-center"
                  } py-2.5 rounded-lg transition-all duration-150 group relative ${
                    isActive
                      ? "text-teal"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full bg-teal"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon
                    size={20}
                    className={isActive ? "text-teal" : ""}
                  />
                  {expanded && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <div className="hidden lg:flex items-center justify-center pb-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Mobile close */}
        <div className="lg:hidden flex items-center justify-center pb-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-accent/50 text-muted-foreground"
          >
            <X size={20} />
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top navbar */}
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent/50 text-muted-foreground"
            >
              <Shield size={20} />
            </button>
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/50 border border-border w-64">
              <Search size={16} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Search threats, logs, agents..."
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
              />
              <kbd className="hidden lg:inline-flex text-xs text-muted-foreground border border-border rounded px-1.5 py-0.5 bg-background/50">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-crimson animate-pulse" />
            </button>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {/* Profile */}
            <div className="flex items-center gap-2 ml-2 pl-3 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center text-teal font-semibold text-sm">
                GM
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
