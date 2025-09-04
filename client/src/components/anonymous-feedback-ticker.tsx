
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Lightbulb, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

interface FeedbackItem {
  id: string;
  type: 'complaint' | 'suggestion';
  category: string;
  preview: string;
  timeAgo: string;
  createdAt: string | any;
}

export default function AnonymousFeedbackTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Fetch complaints and suggestions
  const { data: complaints = [] } = useQuery({
    queryKey: ["/api/complaints"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/complaints");
      return response.json();
    },
  });

  const { data: suggestions = [] } = useQuery({
    queryKey: ["/api/suggestions"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/suggestions");
      return response.json();
    },
  });

  // Transform data for the ticker
  const feedbackItems: FeedbackItem[] = [
    ...complaints.map((complaint: any) => ({
      id: complaint.id,
      type: 'complaint' as const,
      category: complaint.category || 'General',
      preview: complaint.title?.substring(0, 60) + (complaint.title?.length > 60 ? '...' : '') || 'Anonymous complaint submitted',
      timeAgo: getTimeAgo(complaint.createdAt),
      createdAt: complaint.createdAt
    })),
    ...suggestions.map((suggestion: any) => ({
      id: suggestion.id,
      type: 'suggestion' as const,
      category: suggestion.type || 'General',
      preview: suggestion.title?.substring(0, 60) + (suggestion.title?.length > 60 ? '...' : '') || 'Anonymous suggestion submitted',
      timeAgo: getTimeAgo(suggestion.createdAt),
      createdAt: suggestion.createdAt
    }))
  ].sort((a, b) => {
    // Sort by creation date, newest first
    const dateA = parseDate(a.createdAt);
    const dateB = parseDate(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  }).slice(0, 10); // Show only the 10 most recent items

  // Auto-rotate through items every 5 seconds
  useEffect(() => {
    if (feedbackItems.length === 0) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % feedbackItems.length);
        setIsVisible(true);
      }, 300); // Fade out duration
    }, 5000);

    return () => clearInterval(interval);
  }, [feedbackItems.length]);

  function parseDate(dateValue: any): Date {
    if (!dateValue) return new Date();
    
    try {
      if (typeof dateValue === 'object' && 'seconds' in dateValue) {
        return new Date(dateValue.seconds * 1000 + dateValue.nanoseconds / 1000000);
      }
      return new Date(dateValue);
    } catch {
      return new Date();
    }
  }

  function getTimeAgo(dateValue: any): string {
    const date = parseDate(dateValue);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  function getCategoryIcon(type: 'complaint' | 'suggestion') {
    return type === 'complaint' ? 
      <MessageSquare className="h-4 w-4" /> : 
      <Lightbulb className="h-4 w-4" />;
  }

  function getCategoryColor(type: 'complaint' | 'suggestion') {
    return type === 'complaint' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' : 
           'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
  }

  if (feedbackItems.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Live Activity Feed</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <div className="text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activity to display</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentItem = feedbackItems[currentIndex];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Live Activity Feed</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-32 overflow-hidden">
          <div
            className={cn(
              "absolute inset-0 flex items-center transition-opacity duration-300",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="w-full space-y-3">
              <div className="flex items-start space-x-3">
                <div className={cn(
                  "p-2 rounded-full flex-shrink-0",
                  getCategoryColor(currentItem.type)
                )}>
                  {getCategoryIcon(currentItem.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs font-medium", getCategoryColor(currentItem.type))}
                    >
                      {currentItem.type === 'complaint' ? 'Complaint' : 'Suggestion'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">({currentItem.category})</span>
                  </div>
                  <p className="text-sm font-medium text-foreground leading-relaxed mb-2">
                    "{currentItem.preview}"
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {currentItem.timeAgo}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="flex justify-center mt-4">
          <div className="flex space-x-1">
            {feedbackItems.slice(0, 5).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-colors duration-300",
                  index === currentIndex % 5 ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
