import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Search, 
  Filter,
  Eye,
  Clock,
  AlertTriangle,
  FileText,
  Shield,
  CheckCircle2,
  User,
  Calendar,
  Tag,
  Flag
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
  const [viewComplaint, setViewComplaint] = useState<Complaint | null>(null);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <AdminTopbar />

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10 dark:from-red-400/5 dark:to-orange-400/5"></div>
          <div className="relative page-container py-8 sm:py-12">
            <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-8 px-4">
              <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-red-100 dark:bg-red-900/30 rounded-full text-red-700 dark:text-red-300 text-xs sm:text-sm font-medium mb-4 sm:mb-6 shadow-sm">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Administrative Management
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-red-800 to-orange-800 dark:from-white dark:via-red-200 dark:to-orange-300 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
                Complaints Management
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                Review and manage submitted complaints with comprehensive tools and insights
              </p>
            </div>
          </div>
        </div>

        <div className="page-container pb-12">
          {/* Filters */}
          <Card className="mb-6 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 shadow-lg border-none ring-1 ring-gray-200 dark:ring-gray-700">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search complaints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-foreground focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-foreground focus:ring-red-500 focus:border-red-500">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-foreground">
                    <SelectItem value="all">All Status</SelectItem>
                    {STATUS_OPTIONS.map(status => (
                      <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-foreground focus:ring-red-500 focus:border-red-500">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-foreground">
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  <span className="text-sm">
                    {filteredComplaints.length} of {complaints.length} complaints
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Complaints Table */}
          <Card className="border-none ring-1 ring-gray-200 dark:ring-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground">Complaints</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
                  ))}
                </div>
              ) : filteredComplaints.length > 0 ? (
                <div className="overflow-x-auto max-h-96 overflow-y-auto border rounded-xl border-gray-200 dark:border-gray-700">
                  <Table className="table-fixed w-full">
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 hover:bg-red-100 dark:hover:bg-red-900/30">
                        <TableHead className="text-gray-600 dark:text-gray-300 w-24">ID</TableHead>
                        <TableHead className="text-gray-600 dark:text-gray-300 w-80">Subject</TableHead>
                        <TableHead className="text-gray-600 dark:text-gray-300 w-32">Category</TableHead>
                        <TableHead className="text-gray-600 dark:text-gray-300 w-24">Priority</TableHead>
                        <TableHead className="text-gray-600 dark:text-gray-300 w-32">Status</TableHead>
                        <TableHead className="text-gray-600 dark:text-gray-300 w-28">Submitted</TableHead>
                        <TableHead className="text-gray-600 dark:text-gray-300 text-right w-32">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredComplaints.map((complaint) => {
                        const category = CATEGORIES.find(c => c.id === complaint.category);
                        const statusInfo = STATUS_OPTIONS.find(s => s.id === complaint.status);

                        return (
                          <TableRow key={complaint.id} className="hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors duration-200">
                            <TableCell className="font-mono text-sm text-gray-800 dark:text-gray-200 w-24 truncate">{complaint.referenceId}</TableCell>
                            <TableCell className="w-80">
                              <div className="max-w-full">
                                <div className="font-medium text-gray-900 dark:text-gray-100 truncate mb-1" title={complaint.subject}>
                                  {complaint.subject}
                                </div>
                                <div className="text-sm text-muted-foreground line-clamp-2 break-words leading-tight" title={complaint.description}>
                                  {complaint.description}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="w-32">
                              <Badge variant="secondary" className="bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200 truncate">{category?.name}</Badge>
                            </TableCell>
                            <TableCell className="w-24">
                              <Badge 
                                variant={complaint.priority === "high" || complaint.priority === "urgent" ? "destructive" : "secondary"}
                                className={`truncate ${complaint.priority === "high" || complaint.priority === "urgent" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}`}
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
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setViewComplaint(complaint)}
                                  className="text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/40 h-8 w-8 p-0"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                {complaint.status === "pending" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateStatusMutation.mutate({ id: complaint.id, status: "under_review" })}
                                    disabled={updateStatusMutation.isPending}
                                    className="text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/40"
                                  >
                                    Review
                                  </Button>
                                )}
                                {complaint.status === "under_review" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleResolve(complaint)}
                                    className="text-green-600 dark:text-green-400 border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/40"
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
                <div className="text-center py-12 px-4">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-70" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No complaints found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Complaint Details Modal */}
        <Dialog open={!!viewComplaint} onOpenChange={() => setViewComplaint(null)}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-foreground text-xl font-bold">Complaint Details</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Full information about this complaint submission
              </DialogDescription>
            </DialogHeader>
            {viewComplaint && (
              <div className="space-y-6 overflow-y-auto pr-2">
                {/* Header Info */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{viewComplaint.subject}</h3>
                    <Badge className={STATUS_OPTIONS.find(s => s.id === viewComplaint.status)?.color}>
                      {STATUS_OPTIONS.find(s => s.id === viewComplaint.status)?.name}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">ID:</span>
                      <span className="font-mono text-gray-700 dark:text-gray-300">{viewComplaint.referenceId}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Submitted:</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {(() => {
                          if (!viewComplaint.createdAt) return "Unknown";
                          try {
                            let date;
                            if (viewComplaint.createdAt && typeof viewComplaint.createdAt === 'object' && 'seconds' in viewComplaint.createdAt) {
                              const timestamp = viewComplaint.createdAt as any;
                              date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
                            } else {
                              date = new Date(viewComplaint.createdAt);
                            }
                            return !isNaN(date.getTime()) ? format(date, "PPP 'at' p") : "Unknown";
                          } catch {
                            return "Unknown";
                          }
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Category:</span>
                      <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                        {CATEGORIES.find(c => c.id === viewComplaint.category)?.name}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Flag className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Priority:</span>
                      <Badge 
                        variant={viewComplaint.priority === "high" || viewComplaint.priority === "urgent" ? "destructive" : "secondary"}
                        className={viewComplaint.priority === "high" || viewComplaint.priority === "urgent" ? "bg-red-500/20 text-red-600 dark:text-red-400" : "bg-blue-500/20 text-blue-600 dark:text-blue-400"}
                      >
                        {viewComplaint.priority}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-base">Description</h4>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                      {viewComplaint.description}
                    </p>
                  </div>
                </div>

                {/* Resolution (if exists) */}
                {viewComplaint.resolution && (
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3 text-base">Resolution</h4>
                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-green-700 dark:text-green-300 leading-relaxed whitespace-pre-wrap text-sm">
                        {viewComplaint.resolution}
                      </p>
                      {viewComplaint.resolvedAt && (
                        <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                            Resolved on {(() => {
                              try {
                                let date;
                                if (viewComplaint.resolvedAt && typeof viewComplaint.resolvedAt === 'object' && 'seconds' in viewComplaint.resolvedAt) {
                                  const timestamp = viewComplaint.resolvedAt as any;
                                  date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
                                } else {
                                  date = new Date(viewComplaint.resolvedAt);
                                }
                                return !isNaN(date.getTime()) ? format(date, "PPP 'at' p") : "Unknown";
                              } catch {
                                return "Unknown";
                              }
                            })()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    variant="outline" 
                    onClick={() => setViewComplaint(null)}
                    className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Close
                  </Button>
                  {viewComplaint.status === "pending" && (
                    <Button
                      onClick={() => {
                        updateStatusMutation.mutate({ id: viewComplaint.id, status: "under_review" });
                        setViewComplaint(null);
                      }}
                      disabled={updateStatusMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Start Review
                    </Button>
                  )}
                  {viewComplaint.status === "under_review" && (
                    <Button
                      onClick={() => {
                        setSelectedComplaint(viewComplaint);
                        setViewComplaint(null);
                      }}
                      className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark as Resolved
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Resolution Dialog */}
        <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
          <DialogContent className="sm:max-w-[425px] border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-foreground">Resolve Complaint</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Add resolution details for this complaint
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Complaint ID: {selectedComplaint?.referenceId}</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{selectedComplaint?.subject}</p>
              </div>
              <div>
                <label htmlFor="resolution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Resolution Details
                </label>
                <Textarea
                  id="resolution"
                  placeholder="Describe how this complaint was resolved..."
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows={4}
                  className="mt-1 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-foreground focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={() => setSelectedComplaint(null)} className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Cancel
                </Button>
                <Button 
                  onClick={submitResolution}
                  disabled={!resolution.trim() || updateStatusMutation.isPending}
                  className="disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700 focus:ring-red-500"
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