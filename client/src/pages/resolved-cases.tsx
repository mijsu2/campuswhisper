import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { Complaint } from "@shared/schema";
import { CATEGORIES } from "@/lib/constants";

export default function ResolvedCases() {
  const { data: allComplaints = [], isLoading } = useQuery<Complaint[]>({
    queryKey: ["/api/complaints"],
  });

  const resolvedComplaints = allComplaints.filter(complaint => complaint.status === "resolved");
  const recentResolved = resolvedComplaints.slice(0, 3);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" data-testid="resolved-cases-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Resolved Cases</h1>
        <p className="text-muted-foreground">View completed investigations and their outcomes</p>
      </div>

      {/* Success Stories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {recentResolved.length > 0 ? (
          recentResolved.map((complaint) => {
            const category = CATEGORIES.find(c => c.id === complaint.category);
            
            return (
              <Card key={complaint.id} data-testid={`success-story-${complaint.referenceId}`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="text-white h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-green-600">Resolved</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{complaint.subject}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {complaint.resolution || "Resolution details available upon request."}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Resolved: {(() => {
                      if (!complaint.resolvedAt) return "Unknown";
                      try {
                        let date;
                        if (complaint.resolvedAt && typeof complaint.resolvedAt === 'object' && 'seconds' in complaint.resolvedAt) {
                          const timestamp = complaint.resolvedAt as any;
                          date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
                        } else {
                          date = new Date(complaint.resolvedAt);
                        }
                        return !isNaN(date.getTime()) ? format(date, "MMM dd, yyyy") : "Unknown";
                      } catch {
                        return "Unknown";
                      }
                    })()}</span>
                    <span>Category: {category?.name}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No resolved cases yet</h3>
                <p className="text-muted-foreground">Resolved cases will appear here once issues are addressed</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Detailed Resolution Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Resolved Cases</CardTitle>
        </CardHeader>
        <CardContent>
          {resolvedComplaints.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Issue</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Resolution</TableHead>
                    <TableHead>Date Resolved</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resolvedComplaints.map((complaint) => {
                    const category = CATEGORIES.find(c => c.id === complaint.category);
                    
                    return (
                      <TableRow key={complaint.id} data-testid={`resolved-row-${complaint.referenceId}`}>
                        <TableCell>
                          <div className="text-sm font-medium text-foreground">{complaint.subject}</div>
                          <div className="text-sm text-muted-foreground">{complaint.referenceId}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{category?.name}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="text-sm text-foreground line-clamp-2">
                            {complaint.resolution || "Resolution details available"}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {(() => {
                            if (!complaint.resolvedAt) return "N/A";
                            try {
                              let date;
                              if (complaint.resolvedAt && typeof complaint.resolvedAt === 'object' && 'seconds' in complaint.resolvedAt) {
                                const timestamp = complaint.resolvedAt as any;
                                date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
                              } else {
                                date = new Date(complaint.resolvedAt);
                              }
                              return !isNaN(date.getTime()) ? format(date, "MMM dd, yyyy") : "N/A";
                            } catch {
                              return "N/A";
                            }
                          })()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-view-resolution-${complaint.referenceId}`}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No resolved cases yet</h3>
              <p className="text-muted-foreground">Resolved cases will appear here once issues are addressed</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
