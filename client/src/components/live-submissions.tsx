
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Complaint, Suggestion } from "@shared/schema";
import { CATEGORIES } from "@/lib/constants";
import { FileText, Lightbulb, Clock, User, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LiveSubmission {
  id: string;
  type: 'complaint' | 'suggestion';
  category: string;
  subject: string;
  createdAt: any;
  referenceId?: string;
  studentName: string;
}

export default function LiveSubmissions() {
  const [displayedSubmissions, setDisplayedSubmissions] = useState<LiveSubmission[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const { data: complaints = [] } = useQuery<Complaint[]>({
    queryKey: ["/api/complaints"],
    refetchInterval: 3000,
  });

  const { data: suggestions = [] } = useQuery<Suggestion[]>({
    queryKey: ["/api/suggestions"],
    refetchInterval: 3000,
  });

  // Generate student names
  const studentNames = [
    "Alex M.", "Sarah K.", "John D.", "Emily R.", "Michael B.", "Jessica L.",
    "David W.", "Ashley H.", "Ryan C.", "Madison P.", "Tyler S.", "Olivia T.",
    "Jake N.", "Emma G.", "Brandon F.", "Sophia Q.", "Lucas V.", "Ava Z.",
    "Noah J.", "Isabella X.", "Ethan Y.", "Mia U.", "Mason I.", "Charlotte O.",
    "Liam A.", "Amelia E.", "Benjamin R.", "Harper T.", "Elijah Y.", "Evelyn U."
  ];

  useEffect(() => {
    const allSubmissions: LiveSubmission[] = [
      ...complaints.map((complaint, index) => ({
        id: complaint.id,
        type: 'complaint' as const,
        category: complaint.category,
        subject: complaint.subject,
        createdAt: complaint.createdAt,
        referenceId: complaint.referenceId,
        studentName: studentNames[index % studentNames.length],
      })),
      ...suggestions.map((suggestion, index) => ({
        id: suggestion.id,
        type: 'suggestion' as const,
        category: suggestion.category,
        subject: suggestion.subject,
        createdAt: suggestion.createdAt,
        studentName: studentNames[(index + 10) % studentNames.length],
      })),
    ];

    // Sort by creation date and take recent ones
    const sortedSubmissions = allSubmissions
      .sort((a, b) => {
        try {
          let dateA, dateB;
          
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
      });

    // Create cycling display with duplicates for smooth infinite scroll
    if (sortedSubmissions.length > 0) {
      const extendedSubmissions = [...sortedSubmissions, ...sortedSubmissions, ...sortedSubmissions];
      setDisplayedSubmissions(extendedSubmissions);
    }
  }, [complaints, suggestions]);

  // Auto-scroll effect
  useEffect(() => {
    if (displayedSubmissions.length === 0) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % Math.floor(displayedSubmissions.length / 3));
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [displayedSubmissions.length]);

  const formatTime = (createdAt: any) => {
    try {
      let date;
      if (createdAt && typeof createdAt === 'object' && 'seconds' in createdAt) {
        const timestamp = createdAt as any;
        date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
      } else {
        date = new Date(createdAt);
      }
      
      if (isNaN(date.getTime())) return "Just now";
      
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return format(date, "MMM dd");
    } catch {
      return "Just now";
    }
  };

  const generateReferenceId = (submission: LiveSubmission) => {
    if (submission.referenceId) return submission.referenceId;
    
    const year = new Date().getFullYear();
    const idSuffix = submission.id.slice(-4).toUpperCase();
    return `REF-${year}-${idSuffix}`;
  };

  const getVisibleSubmissions = () => {
    if (displayedSubmissions.length === 0) return [];
    const itemsToShow = 5;
    const startIndex = currentIndex;
    return displayedSubmissions.slice(startIndex, startIndex + itemsToShow);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium">Student Activity</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        Real-time student submissions • Auto-updating feed
      </div>
      
      <div className="relative h-80 overflow-hidden">
        <div 
          className={cn(
            "transition-all duration-500 ease-in-out space-y-3",
            isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-2"
          )}
        >
          {displayedSubmissions.length > 0 ? (
            getVisibleSubmissions().map((submission, index) => {
              const category = CATEGORIES.find(c => c.id === submission.category);
              const referenceId = generateReferenceId(submission);
              
              return (
                <div 
                  key={`${submission.id}-${currentIndex}-${index}`}
                  className={cn(
                    "group relative bg-gradient-to-r from-white to-gray-50/30 dark:from-slate-800 dark:to-slate-700/30",
                    "border border-gray-200/60 dark:border-slate-600/60 rounded-lg p-4 shadow-sm",
                    "hover:shadow-md hover:border-blue-300/60 dark:hover:border-blue-500/60",
                    "transition-all duration-300 ease-out transform hover:scale-[1.02]",
                    "backdrop-blur-sm"
                  )}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Animated border effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  
                  <div className="relative flex items-start space-x-3">
                    {/* Avatar */}
                    <div className={cn(
                      "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center",
                      "bg-gradient-to-br shadow-sm",
                      submission.type === 'complaint' 
                        ? "from-blue-100 to-blue-200 dark:from-blue-900/60 dark:to-blue-800/60" 
                        : "from-yellow-100 to-yellow-200 dark:from-yellow-900/60 dark:to-yellow-800/60"
                    )}>
                      {submission.type === 'complaint' ? (
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-foreground">
                            {submission.studentName}
                          </span>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-medium",
                            submission.type === 'complaint'
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
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
                      <p className="text-sm text-foreground/90 mb-2 line-clamp-1 group-hover:text-foreground transition-colors">
                        {submission.subject}
                      </p>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-white/60 dark:bg-slate-700/60"
                        >
                          {category?.name || submission.category}
                        </Badge>
                        
                        <Badge 
                          variant="secondary" 
                          className="text-xs font-mono bg-gray-100/80 dark:bg-gray-700/80"
                        >
                          {referenceId}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16">
              <div className="h-16 w-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Activity className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-foreground mb-2">No student activity yet</p>
              <p className="text-xs text-muted-foreground">
                Student submissions will appear here in real-time
              </p>
            </div>
          )}
        </div>
        
        {/* Gradient fade effect at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none"></div>
      </div>
      
      {/* Status indicator */}
      <div className="flex items-center justify-center space-x-2 pt-3 border-t border-gray-200/60 dark:border-slate-700/60">
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-all duration-300",
                i === (currentIndex % 3) ? "bg-blue-500 scale-125" : "bg-gray-300 dark:bg-gray-600"
              )}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground ml-2">
          Auto-updating every 4 seconds
        </span>
      </div>
    </div>
  );
}
