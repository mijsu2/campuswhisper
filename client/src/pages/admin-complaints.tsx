
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Search, 
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { Complaint } from "@shared/schema";
import { CATEGORIES, STATUS_OPTIONS } from "@/lib/constants";
import { useState } from "react";
import AdminTopbar from "@/components/layout/admin-topbar";

export default function AdminComplaints() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [resolution, setResolution] = useState("");

  const { data: complaints = [], isLoading } = useQuery<Complaint[]>({
    queryKey: ["/api/complaints"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, resolution }: { id: string; status: string; resolution?: string }) => {
      const response = await apiRequest("PATCH", `/api/complaints/${id}/status`, { status, resolution });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Complaint status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/complaints"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setSelectedComplaint(null);
      setResolution("");
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update complaint status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.referenceId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || complaint.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "under_review":
        return <Search className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleResolve = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
  };

  const submitResolution = () => {
    if (selectedComplaint && resolution.trim()) {
      updateStatusMutation.mutate({
        id: selectedComplaint.id,
        status: "resolved",
        resolution: resolution.trim()
      });
    }
  };

  return (
    <>
      <style>{`
        [data-testid="topbar"] {
          display: none !important;
        }
      `}</style>
      <div className="min-h-screen bg-background">
        <AdminTopbar />
        
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">All Complaints</h1>
            <p className="text-muted-foreground">Manage and review all submitted complaints</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search complaints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {STATUS_OPTIONS.map(status => (
                      <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {filteredComplaints.length} of {complaints.length} complaints
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Complaints Table */}
          <Card>
            <CardHeader>
              <CardTitle>Complaints</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
                  ))}
                </div>
              ) : filteredComplaints.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredComplaints.map((complaint) => {
                        const category = CATEGORIES.find(c => c.id === complaint.category);
                        const statusInfo = STATUS_OPTIONS.find(s => s.id === complaint.status);
                        
                        return (
                          <TableRow key={complaint.id} className="hover:bg-muted/50">
                            <TableCell className="font-mono text-sm">{complaint.referenceId}</TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                <div className="font-medium line-clamp-1">{complaint.subject}</div>
                                <div className="text-sm text-muted-foreground line-clamp-2">
                                  {complaint.description}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{category?.name}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={complaint.priority === "high" || complaint.priority === "urgent" ? "destructive" : "secondary"}
                              >
                                {complaint.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(complaint.status)}
                                <Badge className={statusInfo?.color}>
                                  {statusInfo?.name}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {(() => {
                                if (!complaint.createdAt) return "Unknown";
                                try {
                                  let date;
                                  if (complaint.createdAt && typeof complaint.createdAt === 'object' && 'seconds' in complaint.createdAt) {
                                    const timestamp = complaint.createdAt as any;
                                    date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
                                  } else {
                                    date = new Date(complaint.createdAt);
                                  }
                                  return !isNaN(date.getTime()) ? format(date, "MMM dd, HH:mm") : "Unknown";
                                } catch {
                                  return "Unknown";
                                }
                              })()}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {complaint.status === "pending" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateStatusMutation.mutate({ id: complaint.id, status: "under_review" })}
                                    disabled={updateStatusMutation.isPending}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Review
                                  </Button>
                                )}
                                {complaint.status === "under_review" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleResolve(complaint)}
                                  >
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Resolve
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No complaints found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Resolution Dialog */}
        <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Resolve Complaint</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Complaint ID: {selectedComplaint?.referenceId}</p>
                <p className="font-medium">{selectedComplaint?.subject}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Resolution Details</label>
                <Textarea
                  placeholder="Describe how this complaint was resolved..."
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows={4}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedComplaint(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={submitResolution}
                  disabled={!resolution.trim() || updateStatusMutation.isPending}
                >
                  Mark as Resolved
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
