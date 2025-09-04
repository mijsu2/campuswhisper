
import { useQuery } from "@tanstack/react-query";
import StatsCard from "@/components/stats-card";
import CategoryChart from "@/components/charts/category-chart";
import AnonymousFeedbackTicker from "@/components/anonymous-feedback-ticker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  FileText, 
  Clock, 
  Eye, 
  CheckCircle, 
  Plus, 
  Lightbulb, 
  Search,
  TrendingUp,
  Shield,
  Users
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface StatsData {
  total: number;
  pending: number;
  underReview: number;
  resolved: number;
  byCategory: Record<string, number>;
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<StatsData>({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="page-container py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-white/60 dark:bg-slate-800/60 rounded-2xl w-1/2 mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-white/60 dark:bg-slate-800/60 rounded-2xl shadow-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-96 bg-white/60 dark:bg-slate-800/60 rounded-2xl shadow-lg"></div>
              <div className="h-96 bg-white/60 dark:bg-slate-800/60 rounded-2xl shadow-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" data-testid="dashboard-page">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5"></div>
        <div className="relative page-container py-12">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6 shadow-sm">
              <Shield className="w-4 h-4 mr-2" />
              Anonymous & Secure Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-300 bg-clip-text text-transparent mb-4">
              Welcome to Campus Voice
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your trusted platform for anonymous feedback, suggestions, and creating positive change in our campus community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/submit">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8">
                  <Plus className="mr-2 h-5 w-5" />
                  Submit Feedback
                </Button>
              </Link>
              <Link href="/track">
                <Button size="lg" variant="outline" className="border-2 hover:bg-white/50 dark:hover:bg-slate-800/50 shadow-lg hover:shadow-xl transition-all duration-300 px-8">
                  <Search className="mr-2 h-5 w-5" />
                  Track Submissions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container pb-12 -mt-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Total Submissions</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.total || 0}</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600 dark:text-green-400 font-medium">+12.5%</span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">Pending Review</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.pending || 0}</p>
                </div>
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl">
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <span className="text-amber-600 dark:text-amber-400 font-medium">Avg. 2 days</span>
                <span className="text-muted-foreground ml-1">response time</span>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Under Review</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.underReview || 0}</p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl">
                  <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <Users className="h-4 w-4 text-purple-500 mr-1" />
                <span className="text-purple-600 dark:text-purple-400 font-medium">Active review</span>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Resolved</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.resolved || 0}</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <span className="text-green-600 dark:text-green-400 font-medium">98.5%</span>
                <span className="text-muted-foreground ml-1">satisfaction rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Categories and Chart */}
          <div className="lg:col-span-2 space-y-8">
            {/* Submission Categories */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  Submission Categories
                </CardTitle>
                <p className="text-muted-foreground">Choose the category that best describes your feedback</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
                  {CATEGORIES.map((category, index) => (
                    <div
                      key={category.id}
                      className="group relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-700 dark:to-slate-800 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-600/50 cursor-pointer hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                      data-testid={`category-overview-${category.id}`}
                      style={{
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <div className="flex items-center space-x-4">
                          <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg", category.color)}>
                            <span className="text-xl">📊</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {category.name}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {stats?.byCategory[category.id] || 0} submissions
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Submissions by Category Chart */}
            {stats && (
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                    Submissions Overview
                  </CardTitle>
                  <p className="text-muted-foreground">Visual breakdown of submissions by category</p>
                </CardHeader>
                <CardContent className="pt-6">
                  <CategoryChart data={stats.byCategory} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Quick Actions and Live Feedback */}
          <div className="space-y-8">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  Quick Actions
                </CardTitle>
                <p className="text-muted-foreground">Start making a difference today</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/submit">
                  <Button 
                    className="w-full justify-start h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl" 
                    data-testid="quick-action-submit"
                  >
                    <Plus className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">Submit New Complaint</div>
                      <div className="text-xs text-blue-100">Anonymous and secure</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/suggestions">
                  <Button 
                    className="w-full justify-start h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl" 
                    data-testid="quick-action-suggest"
                  >
                    <Lightbulb className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">Share Suggestion</div>
                      <div className="text-xs text-green-100">Help improve campus life</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/track">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-14 border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl" 
                    data-testid="quick-action-track"
                  >
                    <Search className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">Track Submission</div>
                      <div className="text-xs text-muted-foreground">Monitor progress</div>
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <div className="transform hover:scale-105 transition-transform duration-300">
              <AnonymousFeedbackTicker />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
