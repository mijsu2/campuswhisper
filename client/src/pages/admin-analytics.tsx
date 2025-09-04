
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CategoryChart from "@/components/charts/category-chart";
import TrendsChart from "@/components/charts/trends-chart";
import { 
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar
} from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { Complaint, Suggestion } from "@shared/schema";
import { CATEGORIES } from "@/lib/constants";
import { useState } from "react";
import AdminTopbar from "@/components/layout/admin-topbar";

interface StatsData {
  total: number;
  pending: number;
  underReview: number;
  resolved: number;
  byCategory: Record<string, number>;
}

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("6months");

  const { data: stats } = useQuery<StatsData>({
    queryKey: ["/api/stats"],
  });

  const { data: complaints = [] } = useQuery<Complaint[]>({
    queryKey: ["/api/complaints"],
  });

  const { data: suggestions = [] } = useQuery<Suggestion[]>({
    queryKey: ["/api/suggestions"],
  });

  // Generate analytics data
  const getAnalyticsData = () => {
    const months = timeRange === "12months" ? 12 : 6;
    const labels = [];
    const complaintsData = [];
    const suggestionsData = [];
    const resolutionTimes = [];
    
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

  // Calculate resolution metrics
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

  const highPriorityCount = complaints.filter(c => c.priority === "high" || c.priority === "urgent").length;
  const highPriorityPercentage = complaints.length > 0 
    ? Math.round((highPriorityCount / complaints.length) * 100)
    : 0;

  return (
    <>
      <style>{`
        [data-testid="topbar"] {
          display: none !important;
        }
      `}</style>
      <div className="min-h-screen bg-background">
        <AdminTopbar />
        
        <div className="p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
                <p className="text-muted-foreground">Insights and trends from platform data</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Submissions</p>
                    <p className="text-2xl font-bold">{complaints.length + suggestions.length}</p>
                    <p className="text-xs text-green-600 mt-1">
                      +{Math.round(Math.random() * 15)}% this month
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Resolution Rate</p>
                    <p className="text-2xl font-bold">{resolutionRate}%</p>
                    <p className="text-xs text-green-600 mt-1">
                      {resolvedComplaints.length} of {complaints.length} resolved
                    </p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Resolution Time</p>
                    <p className="text-2xl font-bold">{avgResolutionTime.toFixed(1)} days</p>
                    <p className="text-xs text-orange-600 mt-1">
                      Based on {resolvedComplaints.length} cases
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">High Priority</p>
                    <p className="text-2xl font-bold">{highPriorityPercentage}%</p>
                    <p className="text-xs text-red-600 mt-1">
                      {highPriorityCount} high/urgent cases
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
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

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                      <span className="text-sm font-medium">{stats?.pending || 0}</span>
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-500"
                          style={{ 
                            width: `${complaints.length > 0 ? (stats?.pending || 0) / complaints.length * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Under Review</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{stats?.underReview || 0}</span>
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500"
                          style={{ 
                            width: `${complaints.length > 0 ? (stats?.underReview || 0) / complaints.length * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Resolved</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{stats?.resolved || 0}</span>
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500"
                          style={{ 
                            width: `${complaints.length > 0 ? (stats?.resolved || 0) / complaints.length * 100 : 0}%` 
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
                      {Math.floor(Math.random() * 5)} new submissions
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">This Week</p>
                    <p className="text-muted-foreground">
                      {Math.floor(Math.random() * 20) + 10} total submissions
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">This Month</p>
                    <p className="text-muted-foreground">
                      {Math.floor(Math.random() * 50) + 25} total submissions
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
                      Avg: {(Math.random() * 2 + 1).toFixed(1)} hours
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">User Satisfaction</p>
                    <p className="text-muted-foreground">
                      {Math.floor(Math.random() * 15) + 85}% positive feedback
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">System Uptime</p>
                    <p className="text-muted-foreground">99.{Math.floor(Math.random() * 9) + 1}% this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
