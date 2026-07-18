import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import AnalyzeMCPPage from "./pages/AnalyzeMCPPage";
import ThreatReportPage from "./pages/ThreatReportPage";
import AttackReplayPage from "./pages/AttackReplayPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import SettingsPage from "./pages/SettingsPage";
import { DashboardLayout } from "./components/DashboardLayout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/dashboard" component={() => (
        <DashboardLayout>
          <DashboardPage />
        </DashboardLayout>
      )} />
      <Route path="/analyze" component={() => (
        <DashboardLayout>
          <AnalyzeMCPPage />
        </DashboardLayout>
      )} />
      <Route path="/threat-report" component={() => (
        <DashboardLayout>
          <ThreatReportPage />
        </DashboardLayout>
      )} />
      <Route path="/replay" component={() => (
        <DashboardLayout>
          <AttackReplayPage />
        </DashboardLayout>
      )} />
      <Route path="/logs" component={() => (
        <DashboardLayout>
          <AuditLogsPage />
        </DashboardLayout>
      )} />
      <Route path="/settings" component={() => (
        <DashboardLayout>
          <SettingsPage />
        </DashboardLayout>
      )} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
