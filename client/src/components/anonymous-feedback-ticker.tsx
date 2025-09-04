
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Lightbulb, Clock, Hash } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

interface FeedbackItem {
  id: string;
  type: 'complaint' | 'suggestion';
  category: string;
  preview: string;
  timeAgo: string;
  referenceId: string;
  createdAt: string;
}

export default function AnonymousFeedbackTicker() {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeedback = async () => {
    try {
      const [complaintsResponse, suggestionsResponse] = await Promise.all([
        apiRequest("GET", "/api/complaints"),
        apiRequest("GET", "/api/suggestions")
      ]);

      const complaints = await complaintsResponse.json() || [];
      const suggestions = await suggestionsResponse.json() || [];

      const formatItems = (items: any[], type: 'complaint' | 'suggestion') => {
        return items.map((item: any) => ({
          id: item.id,
          type,
          category: type === 'complaint' ? (item.category || 'General') : (item.type || 'General'),
          preview: `New anonymous ${type} submitted`,
          timeAgo: getTimeAgo(item.createdAt),
          referenceId: item.referenceId || 'N/A',
          createdAt: item.createdAt
        }));
      };

      const allItems = [
        ...formatItems(complaints, 'complaint'),
        ...formatItems(suggestions, 'suggestion')
      ].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Most recent first
      }).slice(0, 10); // Show only last 10 items

      setFeedbackItems(allItems);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setIsLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      let date;
      if (dateString && typeof dateString === 'object' && 'seconds' in dateString) {
        const timestamp = dateString as any;
        date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
      } else {
        date = new Date(dateString);
      }
      
      if (isNaN(date.getTime())) return 'Recently';
      
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    } catch {
      return 'Recently';
    }
  };

  useEffect(() => {
    fetchFeedback();
    const interval = setInterval(fetchFeedback, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Auto-refresh effect for new feedback
  useEffect(() => {
    if (feedbackItems.length === 0) return;

    const interval = setInterval(() => {
      fetchFeedback(); // Refresh data to show new feedback
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [feedbackItems.length]);

  if (isLoading) {
    return (
      <Card className="h-[300px]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="animate-pulse h-4 w-4 bg-muted rounded"></div>
            <div className="animate-pulse h-5 w-32 bg-muted rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (feedbackItems.length === 0) {
    return (
      <Card className="h-[300px]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <span>Live Feedback Ticker</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent feedback to display</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentItem = feedbackItems[currentIndex];

  // Get 3 items to display
  const displayItems = feedbackItems.slice(0, 3);

  return (
    <Card className="h-[500px] relative overflow-hidden p-0">
      <CardHeader className="pb-2 pt-4 px-6">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <div className="relative">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <span>Live Feedback Ticker</span>
          <Badge variant="secondary" className="text-xs">
            {feedbackItems.length} active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-4 pt-0 h-[450px]">
        <div className="space-y-4 h-full overflow-y-auto">
          {displayItems.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "border rounded-lg p-4 transition-all duration-500 ease-in-out bg-muted/30",
                "animate-in fade-in slide-in-from-right-4"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header with type and category */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {item.type === 'complaint' ? (
                    <MessageSquare className="h-4 w-4 text-red-500" />
                  ) : (
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                  )}
                  <Badge 
                    variant={item.type === 'complaint' ? 'destructive' : 'default'}
                    className="capitalize text-xs"
                  >
                    {item.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{item.timeAgo}</span>
                </div>
              </div>

              {/* Content Preview */}
              <div className="mb-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.preview}
                </p>
              </div>

              {/* Anonymous User and Reference ID */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-muted-foreground font-medium">Anonymous user</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Hash className="h-3 w-3 text-muted-foreground" />
                  <span className="font-mono text-muted-foreground text-xs">
                    {item.referenceId}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {feedbackItems.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent feedback to display</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
