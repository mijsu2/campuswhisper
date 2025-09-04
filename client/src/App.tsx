import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import Dashboard from "@/pages/dashboard";
import SubmitComplaint from "@/pages/submit-complaint";
import Suggestions from "@/pages/suggestions";
import TrackIssues from "@/pages/track-issues";
import ResolvedCases from "@/pages/resolved-cases";
import FAQ from "@/pages/faq";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminLogin from "@/pages/admin-login";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";
import SecurityBanner from "@/components/layout/security-banner";
import Footer from "@/components/layout/footer";
import ProtectedRoute from "@/components/protected-route";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <SecurityBanner />
      <div className="flex flex-1 bg-background">
        <Switch>
          <Route path="/admin/login" component={AdminLogin} />
          <Route>
            <Sidebar />
            <main className="flex-1 overflow-auto">
              <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/submit" component={SubmitComplaint} />
                <Route path="/suggestions" component={Suggestions} />
                <Route path="/track" component={TrackIssues} />
                <Route path="/resolved" component={ResolvedCases} />
                <Route path="/faq" component={FAQ} />
                <Route path="/admin">
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                </Route>
                <Route component={NotFound} />
              </Switch>
            </main>
          </Route>
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
