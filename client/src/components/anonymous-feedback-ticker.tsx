
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
          preview: item.description?.substring(0, 50) + (item.description?.length > 50 ? '...' : '') || `Anonymous ${type} submitted`,
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
      });

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

  // Auto-rotate through items
  useEffect(() => {
    if (feedbackItems.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % feedbackItems.length);
      }, 4000); // Change every 4 seconds
      return () => clearInterval(interval);
    }
  }, [feedbackItems.length]);

  if (isLoading) {
    return (
      <Card className="h-full">
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
      <Card className="h-full">
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

  return (
    <Card className="h-full relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="relative">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <span>Live Feedback Ticker</span>
          <Badge variant="secondary" className="text-xs">
            {feedbackItems.length} recent submissions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative h-64">
          <div
            key={currentIndex}
            className="absolute inset-0 transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-right-4"
          >
            <div className="flex flex-col h-full justify-between space-y-6">
              {/* Header with type and category */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {currentItem.type === 'complaint' ? (
                    <MessageSquare className="h-4 w-4 text-red-500" />
                  ) : (
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                  )}
                  <Badge 
                    variant={currentItem.type === 'complaint' ? 'destructive' : 'default'}
                    className="capitalize text-xs"
                  >
                    {currentItem.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {currentItem.category}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{currentItem.timeAgo}</span>
                </div>
              </div>

              {/* Content Preview */}
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-4">
                    <p className="leading-relaxed">
                      {currentItem.preview}
                    </p>
                  </div>
                </div>
              </div>

              {/* Anonymous User and Reference ID */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-muted-foreground font-medium">Anonymous user</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Hash className="h-3 w-3 text-muted-foreground" />
                  <span className="font-mono text-xs text-muted-foreground">
                    {currentItem.referenceId}
                  </span>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="flex space-x-1 justify-center">
                {feedbackItems.slice(0, 5).map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      index === (currentIndex % 5) ? "w-6 bg-primary" : "w-1.5 bg-muted"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
