
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Complaint, Suggestion } from "@shared/schema";
import { CATEGORIES } from "@/lib/constants";
import { FileText, Lightbulb, Clock, User, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
  const [newSubmissionIds, setNewSubmissionIds] = useState<Set<string>>(new Set());

  const { data: complaints = [] } = useQuery<Complaint[]>({
    queryKey: ["/api/complaints"],
    refetchInterval: 2000, // Refetch every 2 seconds for real-time updates
  });

  const { data: suggestions = [] } = useQuery<Suggestion[]>({
    queryKey: ["/api/suggestions"],
    refetchInterval: 2000, // Refetch every 2 seconds for real-time updates
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

    const previousIds = new Set(liveSubmissions.map(s => s.id));
    const currentIds = new Set(allSubmissions.map(s => s.id));
    
    // Find new submissions
    const newIds = new Set([...currentIds].filter(id => !previousIds.has(id)));
    
    if (newIds.size > 0) {
      setNewSubmissionIds(newIds);
      // Remove the "new" indicator after 5 seconds
      setTimeout(() => {
        setNewSubmissionIds(prev => {
          const updated = new Set(prev);
          newIds.forEach(id => updated.delete(id));
          return updated;
        });
      }, 5000);
    }

    // Sort by creation date (most recent first) and take the last 15
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
      .slice(0, 15); // Show only the 15 most recent

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
      return format(date, "MMM dd, HH:mm");
    } catch {
      return "Unknown";
    }
  };

  const generateReferenceId = (submission: LiveSubmission) => {
    if (submission.referenceId) return submission.referenceId;
    
    // Generate a reference ID format: REF-YYYY-XXXX
    const year = new Date().getFullYear();
    const idSuffix = submission.id.slice(-4).toUpperCase();
    return `REF-${year}-${idSuffix}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Bell className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium">Live Activity Feed</span>
        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        Real-time submissions from students • Updates every 2 seconds
      </div>
      
      <ScrollArea className="h-96">
        <div className="space-y-2">
          {liveSubmissions.length > 0 ? (
            liveSubmissions.map((submission) => {
              const category = CATEGORIES.find(c => c.id === submission.category);
              const isNew = newSubmissionIds.has(submission.id);
              const referenceId = generateReferenceId(submission);
              
              return (
                <div 
                  key={submission.id} 
                  className={cn(
                    "relative flex items-start space-x-3 p-3 rounded-lg border transition-all duration-300 hover:shadow-sm",
                    isNew 
                      ? "border-blue-300 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-950/30 shadow-sm" 
                      : "border-border hover:bg-accent/30"
                  )}
                >
                  {/* New indicator */}
                  {isNew && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full animate-pulse">
                      <div className="absolute inset-0 h-3 w-3 bg-blue-400 rounded-full animate-ping"></div>
                    </div>
                  )}
                  
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center",
                      submission.type === 'complaint' 
                        ? "bg-blue-100 dark:bg-blue-900/30" 
                        : "bg-yellow-100 dark:bg-yellow-900/30"
                    )}>
                      {submission.type === 'complaint' ? (
                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      )}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="outline" 
                          className="text-xs font-medium"
                        >
                          {category?.name || submission.category}
                        </Badge>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          submission.type === 'complaint'
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                        )}>
                          {submission.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(submission.createdAt)}</span>
                      </div>
                    </div>
                    
                    {/* Subject */}
                    <p className="text-sm font-medium text-foreground line-clamp-2 leading-relaxed">
                      {submission.subject}
                    </p>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>Anonymous Student</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="secondary" 
                          className="text-xs font-mono bg-gray-100 dark:bg-gray-800"
                        >
                          {referenceId}
                        </Badge>
                        {isNew && (
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                            NEW
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">No recent activity</p>
              <p className="text-xs text-muted-foreground">
                Submissions will appear here in real-time
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="flex items-center justify-center space-x-2 pt-2 border-t border-border">
        <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs text-muted-foreground">
          Live monitoring active
        </span>
      </div>
    </div>
  );
}
