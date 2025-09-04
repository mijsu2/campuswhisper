import { Complaint } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CATEGORIES, STATUS_OPTIONS } from "@/lib/constants";

interface IssueCardProps {
  complaint: Complaint;
  showAdminActions?: boolean;
  onStatusUpdate?: (id: string, status: string) => void;
}

export default function IssueCard({ complaint, showAdminActions = false, onStatusUpdate }: IssueCardProps) {
  const category = CATEGORIES.find(c => c.id === complaint.category);
  const statusInfo = STATUS_OPTIONS.find(s => s.id === complaint.status);

  return (
    <div className="bg-card p-6 rounded-lg border border-border shadow-sm" data-testid={`issue-card-${complaint.referenceId}`}>
      <Collapsible>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-foreground">{complaint.subject}</h3>
              <Badge className={cn("text-xs font-medium", statusInfo?.color)}>
                {statusInfo?.name}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Reference ID: <span className="font-mono font-medium">{complaint.referenceId}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Submitted on {(() => {
                if (!complaint.createdAt) return "Unknown date";
                try {
                  const date = new Date(complaint.createdAt);
                  return !isNaN(date.getTime()) ? format(date, "MMM dd, yyyy") : "Unknown date";
                } catch {
                  return "Unknown date";
                }
              })()} • Category: {category?.name}
            </p>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" data-testid={`button-toggle-${complaint.referenceId}`}>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <div className="border-t border-border pt-4">
            <p className="text-sm text-foreground mb-4">{complaint.description}</p>
            
            {complaint.resolution && (
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Resolution</h4>
                <p className="text-sm text-green-700 dark:text-green-300">{complaint.resolution}</p>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-xs text-muted-foreground">Priority: {complaint.priority}</span>
                {complaint.assignedTo && (
                  <span className="text-xs text-muted-foreground">Assigned to: {complaint.assignedTo}</span>
                )}
              </div>
              <div className="flex space-x-2">
                {showAdminActions && onStatusUpdate && (
                  <>
                    {complaint.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onStatusUpdate(complaint.id, "under_review")}
                        data-testid={`button-review-${complaint.referenceId}`}
                      >
                        Start Review
                      </Button>
                    )}
                    {complaint.status === "under_review" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onStatusUpdate(complaint.id, "resolved")}
                        data-testid={`button-resolve-${complaint.referenceId}`}
                      >
                        Mark Resolved
                      </Button>
                    )}
                  </>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const element = document.querySelector(`[data-testid="issue-card-${complaint.referenceId}"]`);
                    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  data-testid={`button-details-${complaint.referenceId}`}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
