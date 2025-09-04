import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/stats-card";
import CategoryChart from "@/components/charts/category-chart";
import TrendsChart from "@/components/charts/trends-chart";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminTopbar from "@/components/layout/admin-topbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Clock, 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  Download,
  Eye,
  CheckCircle2,
  BarChart3,
  Users,
  Calendar
} from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { Complaint, Suggestion } from "@shared/schema";
import { CATEGORIES, STATUS_OPTIONS } from "@/lib/constants";
import { useState } from "react";

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
  const [timeRange, setTimeRange] = useState("6months");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [resolution, setResolution] = useState("");

  const { data: stats, isLoading: statsLoading } = useQuery<StatsData>({
    queryKey: ["/api/stats"],
  });

  const { data: complaints = [], isLoading: complaintsLoading } = useQuery<Complaint[]>({
    queryKey: ["/api/complaints"],
  });

  const { data: suggestions = [] } = useQuery<Suggestion[]>({
    queryKey: ["/api/suggestions"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, resolution }: { id: string; status: string; resolution?: string }) => {
      const response = await apiRequest("PATCH", `/api/complaints/${id}/status`, { status, resolution });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Complaint status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/complaints"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setSelectedComplaint(null);
      setResolution("");
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update complaint status. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate analytics data from real database
  const getAnalyticsData = () => {
    const months = timeRange === "12months" ? 12 : 6;
    const labels = [];
    const complaintsData = [];
    const suggestionsData = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      labels.push(format(date, 'MMM yyyy'));

      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);

      // Count complaints for this month
      const monthComplaints = complaints.filter(c => {
        if (!c.createdAt) return false;
        try {
          let createdDate;
          if (c.createdAt && typeof c.createdAt === 'object' && 'seconds' in c.createdAt) {
            const timestamp = c.createdAt as any;
            createdDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
          } else {
            createdDate = new Date(c.createdAt);
          }
          return !isNaN(createdDate.getTime()) && createdDate >= monthStart && createdDate <= monthEnd;
        } catch {
          return false;
        }
      }).length;

      // Count suggestions for this month
      const monthSuggestions = suggestions.filter(s => {
        if (!s.createdAt) return false;
        try {
          let createdDate;
          if (s.createdAt && typeof s.createdAt === 'object' && 'seconds' in s.createdAt) {
            const timestamp = s.createdAt as any;
            createdDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
          } else {
            createdDate = new Date(s.createdAt);
          }
          return !isNaN(createdDate.getTime()) && createdDate >= monthStart && createdDate <= monthEnd;
        } catch {
          return false;
        }
      }).length;

      complaintsData.push(monthComplaints);
      suggestionsData.push(monthSuggestions);
    }

    return { labels, complaintsData, suggestionsData };
  };

  const analyticsData = getAnalyticsData();
  const recentComplaints = complaints.slice(0, 10);
  const pendingCount = complaints.filter(c => c.status === "pending").length;
  const underReviewCount = complaints.filter(c => c.status === "under_review").length;
  const resolvedCount = complaints.filter(c => c.status === "resolved").length;
  const highPriorityCount = complaints.filter(c => c.priority === "high" || c.priority === "urgent").length;

  // Calculate real resolution metrics
  const resolvedComplaints = complaints.filter(c => c.status === "resolved");
  const avgResolutionTime = resolvedComplaints.length > 0 
    ? (resolvedComplaints.reduce((acc: number, complaint) => {
        if (!complaint.createdAt || !complaint.resolvedAt) return acc;
        try {
          let created, resolved;
          if (complaint.createdAt && typeof complaint.createdAt === 'object' && 'seconds' in complaint.createdAt) {
            const timestamp = complaint.createdAt as any;
            created = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
          } else {
            created = new Date(complaint.createdAt);
          }
          if (complaint.resolvedAt && typeof complaint.resolvedAt === 'object' && 'seconds' in complaint.resolvedAt) {
            const timestamp = complaint.resolvedAt as any;
            resolved = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
          } else {
            resolved = new Date(complaint.resolvedAt);
          }
          if (isNaN(created.getTime()) || isNaN(resolved.getTime())) return acc;
          return acc + (resolved.getTime() - created.getTime());
        } catch {
          return acc;
        }
      }, 0) / resolvedComplaints.length / (1000 * 60 * 60 * 24))
    : 0;

  const resolutionRate = complaints.length > 0 
    ? Math.round((resolvedComplaints.length / complaints.length) * 100)
    : 0;

  // Calculate activity metrics from real data
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const todaySubmissions = [...complaints, ...suggestions].filter(item => {
    if (!item.createdAt) return false;
    try {
      let createdDate;
      if (item.createdAt && typeof item.createdAt === 'object' && 'seconds' in item.createdAt) {
        const timestamp = item.createdAt as any;
        createdDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
      } else {
        createdDate = new Date(item.createdAt);
      }
      return !isNaN(createdDate.getTime()) && createdDate >= todayStart;
    } catch {
      return false;
    }
  }).length;

  const weekSubmissions = [...complaints, ...suggestions].filter(item => {
    if (!item.createdAt) return false;
    try {
      let createdDate;
      if (item.createdAt && typeof item.createdAt === 'object' && 'seconds' in item.createdAt) {
        const timestamp = item.createdAt as any;
        createdDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
      } else {
        createdDate = new Date(item.createdAt);
      }
      return !isNaN(createdDate.getTime()) && createdDate >= weekStart;
    } catch {
      return false;
    }
  }).length;

  const monthSubmissions = [...complaints, ...suggestions].filter(item => {
    if (!item.createdAt) return false;
    try {
      let createdDate;
      if (item.createdAt && typeof item.createdAt === 'object' && 'seconds' in item.createdAt) {
        const timestamp = item.createdAt as any;
        createdDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
      } else {
        createdDate = new Date(item.createdAt);
      }
      return !isNaN(createdDate.getTime()) && createdDate >= monthStart;
    } catch {
      return false;
    }
  }).length;

  const handleResolve = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
  };

  const submitResolution = () => {
    if (selectedComplaint && resolution.trim()) {
      updateStatusMutation.mutate({
        id: selectedComplaint.id,
        status: "resolved",
        resolution: resolution.trim()
      });
    }
  };

  return (
    <>
      <style>{`
        [data-testid="topbar"] {
          display: none !important;
        }
      `}</style>
      <div className="min-h-screen bg-background" data-testid="admin-dashboard">
        <AdminTopbar />

        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard & Analytics</h1>
                <p className="text-muted-foreground">Comprehensive overview and insights from platform data</p>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="12months">Last 12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Submissions"
              value={complaints.length + suggestions.length}
              subtitle={`${complaints.length} complaints, ${suggestions.length} suggestions`}
              icon={BarChart3}
              iconColor="text-blue-600"
              iconBg="bg-blue-100 dark:bg-blue-900/30"
            />
            <StatsCard
              title="Resolution Rate"
              value={`${resolutionRate}%`}
              subtitle={`${resolvedCount} of ${complaints.length} resolved`}
              icon={CheckCircle2}
              iconColor="text-green-600"
              iconBg="bg-green-100 dark:bg-green-900/30"
            />
            <StatsCard
              title="Avg Resolution Time"
              value={avgResolutionTime.toFixed(1)}
              subtitle="days"
              icon={Clock}
              iconColor="text-orange-600"
              iconBg="bg-orange-100 dark:bg-orange-900/30"
            />
            <StatsCard
              title="High Priority"
              value={highPriorityCount}
              subtitle={`${Math.round((highPriorityCount / Math.max(complaints.length, 1)) * 100)}% of total`}
              icon={AlertTriangle}
              iconColor="text-red-600"
              iconBg="bg-red-100 dark:bg-red-900/30"
            />
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Pending Review"
              value={pendingCount}
              subtitle="awaiting attention"
              icon={Clock}
              iconColor="text-amber-600"
              iconBg="bg-amber-100 dark:bg-amber-900/30"
            />
            <StatsCard
              title="Under Investigation"
              value={underReviewCount}
              subtitle="being reviewed"
              icon={Search}
              iconColor="text-blue-600"
              iconBg="bg-blue-100 dark:bg-blue-900/30"
            />
            <StatsCard
              title="Resolved Cases"
              value={resolvedCount}
              subtitle="completed"
              icon={CheckCircle2}
              iconColor="text-green-600"
              iconBg="bg-green-100 dark:bg-green-900/30"
            />
            <StatsCard
              title="Suggestions"
              value={suggestions.length}
              subtitle="total received"
              icon={TrendingUp}
              iconColor="text-purple-600"
              iconBg="bg-purple-100 dark:bg-purple-900/30"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Submissions by Category</span>
                </CardTitle>
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
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Submission Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TrendsChart
                  submissionsData={analyticsData.complaintsData}
                  resolvedData={analyticsData.suggestionsData}
                  labels={analyticsData.labels}
                  datasetLabels={{ submissions: "Complaints", resolved: "Suggestions" }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Activity & Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Status Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Pending Review</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{pendingCount}</span>
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-500"
                          style={{ 
                            width: `${complaints.length > 0 ? (pendingCount / complaints.length) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Under Review</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{underReviewCount}</span>
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500"
                          style={{ 
                            width: `${complaints.length > 0 ? (underReviewCount / complaints.length) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Resolved</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{resolvedCount}</span>
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500"
                          style={{ 
                            width: `${complaints.length > 0 ? (resolvedCount / complaints.length) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium">Today</p>
                    <p className="text-muted-foreground">
                      {todaySubmissions} new submissions
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">This Week</p>
                    <p className="text-muted-foreground">
                      {weekSubmissions} total submissions
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">This Month</p>
                    <p className="text-muted-foreground">
                      {monthSubmissions} total submissions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Performance Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium">Response Time</p>
                    <p className="text-muted-foreground">
                      Avg: {avgResolutionTime.toFixed(1)} days
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Resolution Rate</p>
                    <p className="text-muted-foreground">
                      {resolutionRate}% cases resolved
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">High Priority</p>
                    <p className="text-muted-foreground">
                      {highPriorityCount} urgent cases
                    </p>
                  </div>
                </div>
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
                <div className="overflow-x-auto max-h-96 overflow-y-auto border rounded-md">
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
                              <div className="flex items-center space-x-2">
                                {(() => {
                                  switch (complaint.status) {
                                    case "pending":
                                      return <Clock className="h-4 w-4" />;
                                    case "under_review":
                                      return <Search className="h-4 w-4" />;
                                    case "resolved":
                                      return <CheckCircle2 className="h-4 w-4" />;
                                    default:
                                      return <AlertTriangle className="h-4 w-4" />;
                                  }
                                })()}
                                <Badge className={statusInfo?.color}>
                                  {statusInfo?.name}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {(() => {
                                if (!complaint.createdAt) return "Unknown";
                                try {
                                  let date;
                                  if (complaint.createdAt && typeof complaint.createdAt === 'object' && 'seconds' in complaint.createdAt) {
                                    const timestamp = complaint.createdAt as any;
                                    date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
                                  } else {
                                    date = new Date(complaint.createdAt);
                                  }
                                  return !isNaN(date.getTime()) ? format(date, "MMM dd, HH:mm") : "Unknown";
                                } catch {
                                  return "Unknown";
                                }
                              })()}
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
                                    onClick={() => handleResolve(complaint)}
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
      </div>

      {/* Resolution Dialog */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Complaint</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Complaint ID: {selectedComplaint?.referenceId}</p>
              <p className="font-medium">{selectedComplaint?.subject}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Resolution Details</label>
              <Textarea
                placeholder="Describe how this complaint was resolved..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSelectedComplaint(null)}>
                Cancel
              </Button>
              <Button 
                onClick={submitResolution}
                disabled={!resolution.trim() || updateStatusMutation.isPending}
              >
                Mark as Resolved
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}