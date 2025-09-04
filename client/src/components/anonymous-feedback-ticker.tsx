
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

  useEffect(() => {
    if (feedbackItems.length === 0) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === feedbackItems.length - 1 ? 0 : prevIndex + 1
        );
        setIsVisible(true);
      }, 300); // Half of transition duration
    }, 4000); // Change every 4 seconds

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

  return (
    <Card className="h-[300px] relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="relative">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <span>Live Feedback Ticker</span>
          <Badge variant="secondary" className="text-xs">
            {currentIndex + 1} of {feedbackItems.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative h-48">
        <div
          className={cn(
            "transition-all duration-600 ease-in-out absolute inset-0 p-4",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}
        >
          {currentItem && (
            <div className="space-y-4">
              {/* Header with type and category */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {currentItem.type === 'complaint' ? (
                    <MessageSquare className="h-5 w-5 text-red-500" />
                  ) : (
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                  )}
                  <Badge 
                    variant={currentItem.type === 'complaint' ? 'destructive' : 'default'}
                    className="capitalize"
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

              {/* Reference ID */}
              <div className="flex items-center space-x-2 text-sm">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-muted-foreground">
                  {currentItem.referenceId}
                </span>
              </div>

              {/* Preview text */}
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm text-foreground leading-relaxed">
                  "{currentItem.preview}"
                </p>
              </div>

              {/* Progress indicator */}
              <div className="flex space-x-1 justify-center mt-4">
                {feedbackItems.slice(0, 8).map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-all duration-300",
                      index === currentIndex 
                        ? "bg-primary w-6" 
                        : "bg-muted-foreground/30"
                    )}
                  />
                ))}
                {feedbackItems.length > 8 && (
                  <div className="text-xs text-muted-foreground ml-2">
                    +{feedbackItems.length - 8}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
