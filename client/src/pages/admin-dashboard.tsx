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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Search,
  TrendingUp,
  Users,
  Lightbulb,
  BarChart3,
  Calendar,
  Shield,
  Download,
  Eye,
  CheckCircle2
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
  recent: number;
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
  const recentComplaints = complaints.slice(0, 5); // Changed to 5 for better display
  const recentSuggestions = suggestions.slice(0, 5); // Changed to 5 for better display
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending": return "outline";
      case "under_review": return "secondary";
      case "resolved": return "default";
      default: return "secondary";
    }
  };

  const categoryData = stats ? stats.byCategory : {};

  return (
    <>
      <style>{`
        [data-testid="topbar"] {
          display: none !important;
        }
        .page-container {
          max-width: 1280px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1rem;
          padding-right: 1rem;
        }
        @media (min-width: 1024px) {
          .page-container {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <AdminTopbar />

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10 dark:from-red-400/5 dark:to-orange-400/5"></div>
          <div className="relative page-container py-8 sm:py-12">
            <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-8 px-4">
              <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-red-100 dark:bg-red-900/30 rounded-full text-red-700 dark:text-red-300 text-xs sm:text-sm font-medium mb-4 sm:mb-6 shadow-sm">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Administrative Dashboard
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-red-800 to-orange-800 dark:from-white dark:via-red-200 dark:to-orange-300 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
                Dashboard & Analytics
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                Comprehensive overview and insights from platform data
              </p>

              <div className="flex justify-center">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-48 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="12months">Last 12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="page-container pb-12">
          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-6xl mx-auto px-4">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Total Complaints</CardTitle>
                <div className="bg-red-100 dark:bg-red-900/30 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">{stats ? stats.total : 'Loading...'}</div>
                <p className="text-xs text-muted-foreground">
                  {stats && stats.recent > 0 ? `+${stats.recent} this week` : 'No new complaints this week'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Resolution Rate</CardTitle>
                <div className="bg-green-100 dark:bg-green-900/30 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">{complaints.length > 0 ? `${resolutionRate}%` : 'N/A'}</div>
                <p className="text-xs text-muted-foreground">
                  {resolvedCount} of {complaints.length} resolved
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Avg Resolution Time</CardTitle>
                <div className="bg-yellow-100 dark:bg-yellow-900/30 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-purple-600 bg-clip-text text-transparent">{avgResolutionTime > 0 ? avgResolutionTime.toFixed(1) : 'N/A'}</div>
                <p className="text-xs text-muted-foreground">
                  days
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">High Priority</CardTitle>
                <div className="bg-red-100 dark:bg-red-900/30 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">{highPriorityCount}</div>
                <p className="text-xs text-muted-foreground">
                  {complaints.length > 0 ? `${Math.round((highPriorityCount / complaints.length) * 100)}% of total` : '0% of total'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-6xl mx-auto px-4">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Pending</CardTitle>
                <div className="bg-yellow-100 dark:bg-yellow-900/30 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats ? stats.pending : 'Loading...'}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting review
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Under Review</CardTitle>
                <div className="bg-blue-100 dark:bg-blue-900/30 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats ? stats.underReview : 'Loading...'}</div>
                <p className="text-xs text-muted-foreground">
                  Being investigated
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Resolved</CardTitle>
                <div className="bg-green-100 dark:bg-green-900/30 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats ? stats.resolved : 'Loading...'}</div>
                <p className="text-xs text-muted-foreground">
                  Successfully handled
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Suggestions</CardTitle>
                <div className="bg-purple-100 dark:bg-purple-900/30 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{suggestions.length}</div>
                <p className="text-xs text-muted-foreground">
                  total received
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-6xl mx-auto px-4">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-slate-900 to-red-700 dark:from-white dark:to-red-300 bg-clip-text text-transparent">Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <CategoryChart data={categoryData} />
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-slate-900 to-red-700 dark:from-white dark:to-red-300 bg-clip-text text-transparent">Trends Over Time</CardTitle>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-6xl mx-auto px-4">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <CardTitle className="flex items-center bg-gradient-to-r from-slate-900 to-blue-700 dark:from-white dark:to-blue-300 bg-clip-text text-transparent">
                  <div className="bg-blue-100 dark:bg-blue-900/30 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  Status Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Pending Review</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{pendingCount}</span>
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500 transition-all duration-500"
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
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-500"
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
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all duration-500"
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

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <CardTitle className="flex items-center bg-gradient-to-r from-slate-900 to-cyan-700 dark:from-white dark:to-cyan-300 bg-clip-text text-transparent">
                  <div className="bg-cyan-100 dark:bg-cyan-900/30 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                    <Calendar className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <CardTitle className="flex items-center bg-gradient-to-r from-slate-900 to-indigo-700 dark:from-white dark:to-indigo-300 bg-clip-text text-transparent">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                    <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm">
                    <p className="font-medium">Response Time</p>
                    <p className="text-muted-foreground">
                      Avg: {avgResolutionTime > 0 ? avgResolutionTime.toFixed(1) : 'N/A'} days
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Resolution Rate</p>
                    <p className="text-muted-foreground">
                      {complaints.length > 0 ? `${resolutionRate}%` : 'N/A'} cases resolved
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
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 max-w-6xl mx-auto px-4">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="bg-gradient-to-r from-slate-900 to-red-700 dark:from-white dark:to-red-300 bg-clip-text text-transparent">Recent Submissions</CardTitle>
              <div className="flex space-x-2">
                <Button variant="secondary" size="sm" data-testid="button-export-data" className="shadow-md">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
                <Link href="/track">
                  <Button size="sm" data-testid="button-view-all" className="shadow-md">
                    View All
                  </Button>
                </Link>
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
                <div className="overflow-x-auto max-h-96 overflow-y-auto border rounded-md shadow-inner bg-white/50 dark:bg-slate-800/50">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-muted-foreground font-normal">ID</TableHead>
                        <TableHead className="text-muted-foreground font-normal">Subject</TableHead>
                        <TableHead className="text-muted-foreground font-normal">Category</TableHead>
                        <TableHead className="text-muted-foreground font-normal">Priority</TableHead>
                        <TableHead className="text-muted-foreground font-normal">Status</TableHead>
                        <TableHead className="text-muted-foreground font-normal">Submitted</TableHead>
                        <TableHead className="text-muted-foreground font-normal">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentComplaints.map((complaint) => {
                        const category = CATEGORIES.find(c => c.id === complaint.category);
                        const statusInfo = STATUS_OPTIONS.find(s => s.id === complaint.status);

                        return (
                          <TableRow
                            key={complaint.id}
                            className="hover:bg-gradient-to-r from-red-50 to-orange-50 dark:hover:from-slate-800 dark:hover:to-slate-900/50 transition-colors duration-200"
                            data-testid={`admin-row-${complaint.referenceId}`}
                          >
                            <TableCell className="font-mono text-sm text-foreground">{complaint.referenceId}</TableCell>
                            <TableCell>
                              <div className="text-sm font-medium text-foreground line-clamp-1">
                                {complaint.subject}
                              </div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {complaint.description}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="shadow-sm">{category?.name || 'N/A'}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={complaint.priority === "high" || complaint.priority === "urgent" ? "destructive" : "secondary"}
                                className="shadow-sm"
                              >
                                {complaint.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {(() => {
                                  switch (complaint.status) {
                                    case "pending":
                                      return <Clock className="h-4 w-4 text-yellow-500" />;
                                    case "under_review":
                                      return <Search className="h-4 w-4 text-blue-500" />;
                                    case "resolved":
                                      return <CheckCircle className="h-4 w-4 text-green-500" />;
                                    default:
                                      return <AlertTriangle className="h-4 w-4 text-gray-500" />;
                                  }
                                })()}
                                <Badge className={statusInfo?.color + " shadow-sm"}>
                                  {statusInfo?.name || 'Unknown'}
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
                                    size="xs"
                                    variant="outline"
                                    onClick={() => updateStatusMutation.mutate({ id: complaint.id, status: "under_review" })}
                                    disabled={updateStatusMutation.isPending}
                                    data-testid={`button-assign-${complaint.referenceId}`}
                                    className="shadow-sm"
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Review
                                  </Button>
                                )}
                                {complaint.status === "under_review" && (
                                  <Button
                                    size="xs"
                                    variant="outline"
                                    onClick={() => handleResolve(complaint)}
                                    data-testid={`button-resolve-${complaint.referenceId}`}
                                    className="shadow-sm"
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
        <DialogContent className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-slate-900 to-red-700 dark:from-white dark:to-red-300 bg-clip-text text-transparent">Resolve Complaint</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Complaint ID: {selectedComplaint?.referenceId}</p>
              <p className="font-medium text-foreground">{selectedComplaint?.subject}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Resolution Details</label>
              <Textarea
                placeholder="Describe how this complaint was resolved..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSelectedComplaint(null)} className="shadow-sm">
                Cancel
              </Button>
              <Button
                onClick={submitResolution}
                disabled={!resolution.trim() || updateStatusMutation.isPending}
                className="shadow-sm"
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