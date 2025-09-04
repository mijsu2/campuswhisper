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
  Search 
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
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" data-testid="dashboard-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Campus Voice</h1>
        <p className="text-muted-foreground">Your anonymous platform for feedback and suggestions</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Submissions"
          value={stats?.total || 0}
          icon={FileText}
          iconColor="text-blue-600"
          iconBg="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatsCard
          title="Pending Review"
          value={stats?.pending || 0}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-100 dark:bg-amber-900/30"
        />
        <StatsCard
          title="Under Review"
          value={stats?.underReview || 0}
          icon={Eye}
          iconColor="text-blue-600"
          iconBg="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatsCard
          title="Resolved"
          value={stats?.resolved || 0}
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBg="bg-green-100 dark:bg-green-900/30"
        />
      </div>

      {/* Categories Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Submission Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CATEGORIES.map((category) => (
                  <div
                    key={category.id}
                    className="category-card bg-accent p-4 rounded-lg border border-border cursor-pointer hover:border-primary transition-all duration-300"
                    data-testid={`category-overview-${category.id}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center text-white", category.color)}>
                        📊
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{category.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {stats?.byCategory[category.id] || 0} submissions
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/submit">
                  <Button className="w-full justify-start" data-testid="quick-action-submit">
                    <Plus className="mr-2 h-4 w-4" />
                    Submit New Complaint
                  </Button>
                </Link>
                <Link href="/suggestions">
                  <Button variant="secondary" className="w-full justify-start" data-testid="quick-action-suggest">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Share Suggestion
                  </Button>
                </Link>
                <Link href="/track">
                  <Button variant="outline" className="w-full justify-start" data-testid="quick-action-track">
                    <Search className="mr-2 h-4 w-4" />
                    Track Submission
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Category Chart and Live Feedback Ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 items-start">
        <div className="lg:col-span-2">
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle>Submissions by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryChart data={stats.byCategory} />
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="self-start">
          <AnonymousFeedbackTicker />
        </div>
      </div>
    </div>
  );
}
