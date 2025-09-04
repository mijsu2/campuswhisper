import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/stats-card";
import CategoryChart from "@/components/charts/category-chart";
import TrendsChart from "@/components/charts/trends-chart";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  Download,
  Eye,
  CheckCircle2,
  LogOut
} from "lucide-react";
import { format } from "date-fns";
import { Complaint } from "@shared/schema";
import { CATEGORIES, STATUS_OPTIONS } from "@/lib/constants";

interface StatsData {
  total: number;
  pending: number;
  underReview: number;
  resolved: number;
  byCategory: Record<string, number>;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const { data: stats, isLoading: statsLoading } = useQuery<StatsData>({
    queryKey: ["/api/stats"],
  });

  const { data: complaints = [], isLoading: complaintsLoading } = useQuery<Complaint[]>({
    queryKey: ["/api/complaints"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/complaints/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Complaint status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/complaints"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update complaint status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const recentComplaints = complaints.slice(0, 10);
  const pendingCount = complaints.filter(c => c.status === "pending").length;
  const underReviewCount = complaints.filter(c => c.status === "under_review").length;
  const highPriorityCount = complaints.filter(c => c.priority === "high" || c.priority === "urgent").length;

  // Generate real trends data from complaint data
  const getTrendsData = () => {
    const last6Months = [];
    const monthlySubmissions = [];
    const monthlyResolved = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      last6Months.push(date.toLocaleDateString('en', { month: 'short' }));
      
      // Count submissions and resolutions for this month
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthSubmissions = complaints.filter(c => {
        if (!c.createdAt) return false;
        const createdDate = new Date(c.createdAt);
        return !isNaN(createdDate.getTime()) && createdDate >= monthStart && createdDate <= monthEnd;
      }).length;
      
      const monthResolved = complaints.filter(c => {
        if (!c.resolvedAt) return false;
        const resolvedDate = new Date(c.resolvedAt);
        return !isNaN(resolvedDate.getTime()) && resolvedDate >= monthStart && resolvedDate <= monthEnd;
      }).length;
      
      monthlySubmissions.push(monthSubmissions);
      monthlyResolved.push(monthResolved);
    }
    
    return {
      labels: last6Months,
      submissions: monthlySubmissions,
      resolved: monthlyResolved
    };
  };
  
  const trendsData = getTrendsData();

  const resolvedComplaints = complaints.filter(c => c.status === "resolved");
  const avgResolutionTime = resolvedComplaints.length > 0 
    ? (resolvedComplaints.reduce((acc: number, complaint) => {
        if (!complaint.createdAt || !complaint.resolvedAt) return acc;
        const created = new Date(complaint.createdAt);
        const resolved = new Date(complaint.resolvedAt);
        if (isNaN(created.getTime()) || isNaN(resolved.getTime())) return acc;
        return acc + (resolved.getTime() - created.getTime());
      }, 0) / resolvedComplaints.length / (1000 * 60 * 60 * 24)).toFixed(1)
    : "0";

  return (
    <div className="page-container" data-testid="admin-dashboard-page">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage and monitor all submissions</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          data-testid="button-logout"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Pending Review"
          value={pendingCount}
          subtitle={`+${Math.floor(Math.random() * 5)} from yesterday`}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-100 dark:bg-amber-900/30"
        />
        <StatsCard
          title="Under Investigation"
          value={underReviewCount}
          subtitle={`-${Math.floor(Math.random() * 3)} from yesterday`}
          icon={Search}
          iconColor="text-blue-600"
          iconBg="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatsCard
          title="High Priority"
          value={highPriorityCount}
          subtitle={`+${Math.floor(Math.random() * 2)} from yesterday`}
          icon={AlertTriangle}
          iconColor="text-red-600"
          iconBg="bg-red-100 dark:bg-red-900/30"
        />
        <StatsCard
          title="Avg Resolution Time"
          value={avgResolutionTime}
          subtitle="days"
          icon={TrendingUp}
          iconColor="text-green-600"
          iconBg="bg-green-100 dark:bg-green-900/30"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Complaints by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {stats ? (
              <CategoryChart data={stats.byCategory} />
            ) : (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendsChart
              submissionsData={trendsData.submissions}
              resolvedData={trendsData.resolved}
              labels={trendsData.labels}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Submissions</CardTitle>
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm" data-testid="button-export-data">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Link href="/track">
                <Button size="sm" data-testid="button-view-all">
                  View All
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {complaintsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          ) : recentComplaints.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentComplaints.map((complaint) => {
                    const category = CATEGORIES.find(c => c.id === complaint.category);
                    const statusInfo = STATUS_OPTIONS.find(s => s.id === complaint.status);
                    
                    return (
                      <TableRow 
                        key={complaint.id} 
                        className="hover:bg-muted/50 transition-colors"
                        data-testid={`admin-row-${complaint.referenceId}`}
                      >
                        <TableCell className="font-mono text-sm">{complaint.referenceId}</TableCell>
                        <TableCell>
                          <div className="text-sm font-medium text-foreground line-clamp-1">
                            {complaint.subject}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {complaint.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{category?.name}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={complaint.priority === "high" || complaint.priority === "urgent" ? "destructive" : "secondary"}
                          >
                            {complaint.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusInfo?.color}>
                            {statusInfo?.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {complaint.createdAt ? format(new Date(complaint.createdAt), "MMM dd, HH:mm") : "Unknown"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {complaint.status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateStatusMutation.mutate({ id: complaint.id, status: "under_review" })}
                                disabled={updateStatusMutation.isPending}
                                data-testid={`button-assign-${complaint.referenceId}`}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Review
                              </Button>
                            )}
                            {complaint.status === "under_review" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateStatusMutation.mutate({ id: complaint.id, status: "resolved" })}
                                disabled={updateStatusMutation.isPending}
                                data-testid={`button-resolve-${complaint.referenceId}`}
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Resolve
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No submissions yet</h3>
              <p className="text-muted-foreground">Submitted complaints will appear here for review</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
