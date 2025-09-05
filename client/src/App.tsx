import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./contexts/auth-context";
import { Toaster } from "./components/ui/toaster";
import Dashboard from "./pages/dashboard";
import SubmitComplaint from "./pages/submit-complaint";
import TrackIssues from "./pages/track-issues";
import ResolvedCases from "./pages/resolved-cases";
import FAQ from "./pages/faq";
import Suggestions from "./pages/suggestions";
import AdminLogin from "./pages/admin-login";
import AdminDashboard from "./pages/admin-dashboard";
import AdminComplaints from "./pages/admin-complaints";
import AdminSuggestions from "./pages/admin-suggestions";
import AdminAnalytics from "./pages/admin-analytics";

import NotFound from "./pages/not-found";
import Topbar from "./components/layout/topbar";
import SecurityBanner from "./components/layout/security-banner";
import Footer from "./components/layout/footer";
import ProtectedRoute from "./components/protected-route";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Switch>
        <Route path="/admin/login" component={AdminLogin} />
        <Route>
          <SecurityBanner />
          <Topbar />
          <main className="flex-1 bg-background">
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
              <Route path="/admin/complaints" component={AdminComplaints} />
              <Route path="/admin/suggestions" component={AdminSuggestions} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </Route>
      </Switch>
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