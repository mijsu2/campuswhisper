
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Complaint, Suggestion } from "@shared/schema";
import { CATEGORIES } from "@/lib/constants";
import { FileText, Lightbulb, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface LiveSubmission {
  id: string;
  type: 'complaint' | 'suggestion';
  category: string;
  subject: string;
  createdAt: any;
  referenceId?: string;
}

export default function LiveSubmissions() {
  const [liveSubmissions, setLiveSubmissions] = useState<LiveSubmission[]>([]);

  const { data: complaints = [] } = useQuery<Complaint[]>({
    queryKey: ["/api/complaints"],
    refetchInterval: 5000, // Refetch every 5 seconds for live updates
  });

  const { data: suggestions = [] } = useQuery<Suggestion[]>({
    queryKey: ["/api/suggestions"],
    refetchInterval: 5000, // Refetch every 5 seconds for live updates
  });

  useEffect(() => {
    // Combine and sort submissions by creation date (most recent first)
    const allSubmissions: LiveSubmission[] = [
      ...complaints.map(complaint => ({
        id: complaint.id,
        type: 'complaint' as const,
        category: complaint.category,
        subject: complaint.subject,
        createdAt: complaint.createdAt,
        referenceId: complaint.referenceId,
      })),
      ...suggestions.map(suggestion => ({
        id: suggestion.id,
        type: 'suggestion' as const,
        category: suggestion.category,
        subject: suggestion.subject,
        createdAt: suggestion.createdAt,
      })),
    ];

    // Sort by creation date (most recent first) and take the last 10
    const sortedSubmissions = allSubmissions
      .sort((a, b) => {
        try {
          let dateA, dateB;
          
          // Handle Firestore timestamp format
          if (a.createdAt && typeof a.createdAt === 'object' && 'seconds' in a.createdAt) {
            const timestamp = a.createdAt as any;
            dateA = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
          } else {
            dateA = new Date(a.createdAt);
          }
          
          if (b.createdAt && typeof b.createdAt === 'object' && 'seconds' in b.createdAt) {
            const timestamp = b.createdAt as any;
            dateB = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
          } else {
            dateB = new Date(b.createdAt);
          }
          
          return dateB.getTime() - dateA.getTime();
        } catch {
          return 0;
        }
      })
      .slice(0, 10); // Show only the 10 most recent

    setLiveSubmissions(sortedSubmissions);
  }, [complaints, suggestions]);

  const formatTime = (createdAt: any) => {
    try {
      let date;
      if (createdAt && typeof createdAt === 'object' && 'seconds' in createdAt) {
        const timestamp = createdAt as any;
        date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
      } else {
        date = new Date(createdAt);
      }
      
      if (isNaN(date.getTime())) return "Unknown";
      
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return format(date, "MMM dd");
    } catch {
      return "Unknown";
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Recent submissions from students
      </div>
      
      <ScrollArea className="h-80">
        <div className="space-y-3">
          {liveSubmissions.length > 0 ? (
            liveSubmissions.map((submission) => {
              const category = CATEGORIES.find(c => c.id === submission.category);
              
              return (
                <div 
                  key={submission.id} 
                  className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {submission.type === 'complaint' ? (
                      <FileText className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Lightbulb className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                      >
                        {category?.name || submission.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground capitalize">
                        {submission.type}
                      </span>
                    </div>
                    
                    <p className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                      {submission.subject}
                    </p>
                    
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(submission.createdAt)}</span>
                      {submission.referenceId && (
                        <span className="font-mono">#{submission.referenceId.slice(-6)}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="text-xs text-muted-foreground text-center">
        Updates every 5 seconds
      </div>
    </div>
  );
}
