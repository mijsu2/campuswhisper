import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import SubmitComplaint from "@/pages/submit-complaint";
import Suggestions from "@/pages/suggestions";
import TrackIssues from "@/pages/track-issues";
import ResolvedCases from "@/pages/resolved-cases";
import FAQ from "@/pages/faq";
import AdminDashboard from "@/pages/admin-dashboard";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";
import SecurityBanner from "@/components/layout/security-banner";

function Router() {
  return (
    <div className="h-full">
      <SecurityBanner />
      <div className="flex h-[calc(100vh-60px)] bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/submit" component={SubmitComplaint} />
            <Route path="/suggestions" component={Suggestions} />
            <Route path="/track" component={TrackIssues} />
            <Route path="/resolved" component={ResolvedCases} />
            <Route path="/faq" component={FAQ} />
            <Route path="/admin" component={AdminDashboard} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
