
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Search, 
  Filter,
  Lightbulb,
  CheckCircle2,
  Clock,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { Suggestion } from "@shared/schema";
import { CATEGORIES } from "@/lib/constants";
import { useState } from "react";
import AdminTopbar from "@/components/layout/admin-topbar";

const SUGGESTION_STATUS_OPTIONS = [
  { id: "pending", name: "Pending Review", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
  { id: "under_review", name: "Under Review", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  { id: "approved", name: "Approved", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  { id: "implemented", name: "Implemented", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  { id: "rejected", name: "Rejected", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
];

export default function AdminSuggestions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: suggestions = [], isLoading } = useQuery<Suggestion[]>({
    queryKey: ["/api/suggestions"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/suggestions/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Suggestion status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/suggestions"] });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update suggestion status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredSuggestions = suggestions.filter(suggestion => {
    const matchesSearch = suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suggestion.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || suggestion.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || suggestion.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "under_review":
        return <Eye className="h-4 w-4" />;
      case "approved":
      case "implemented":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <>
      <style>{`
        [data-testid="topbar"] {
          display: none !important;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <AdminTopbar />
        
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-amber-600/10 dark:from-orange-400/5 dark:to-amber-400/5"></div>
          <div className="relative page-container py-8 sm:py-12">
            <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-8 px-4">
              <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-700 dark:text-orange-300 text-xs sm:text-sm font-medium mb-4 sm:mb-6 shadow-sm">
                <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Community Suggestions
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-orange-800 to-amber-800 dark:from-white dark:via-orange-200 dark:to-amber-300 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
                Suggestions Management
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                Review and manage improvement suggestions from the community
              </p>
            </div>
          </div>
        </div>
        
        <div className="page-container pb-12">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Suggestions</p>
                    <p className="text-2xl font-bold">{suggestions.length}</p>
                  </div>
                  <Lightbulb className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                    <p className="text-2xl font-bold">
                      {suggestions.filter(s => s.status === "pending").length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Implemented</p>
                    <p className="text-2xl font-bold">
                      {suggestions.filter(s => s.status === "implemented").length}
                    </p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Approval Rate</p>
                    <p className="text-2xl font-bold">
                      {suggestions.length > 0 
                        ? Math.round((suggestions.filter(s => s.status === "approved" || s.status === "implemented").length / suggestions.length) * 100)
                        : 0}%
                    </p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search suggestions..."
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
                    {SUGGESTION_STATUS_OPTIONS.map(status => (
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
                    {filteredSuggestions.length} of {suggestions.length} suggestions
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggestions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
                  ))}
                </div>
              ) : filteredSuggestions.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSuggestions.map((suggestion) => {
                        const category = CATEGORIES.find(c => c.id === suggestion.category);
                        const statusInfo = SUGGESTION_STATUS_OPTIONS.find(s => s.id === suggestion.status);
                        
                        return (
                          <TableRow key={suggestion.id} className="hover:bg-muted/50">
                            <TableCell>
                              <div className="max-w-xs">
                                <div className="font-medium line-clamp-1">{suggestion.title}</div>
                                <div className="text-sm text-muted-foreground line-clamp-2">
                                  {suggestion.description}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{category?.name}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(suggestion.status)}
                                <Badge className={statusInfo?.color}>
                                  {statusInfo?.name}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {(() => {
                                if (!suggestion.createdAt) return "Unknown";
                                try {
                                  let date;
                                  if (suggestion.createdAt && typeof suggestion.createdAt === 'object' && 'seconds' in suggestion.createdAt) {
                                    const timestamp = suggestion.createdAt as any;
                                    date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
                                  } else {
                                    date = new Date(suggestion.createdAt);
                                  }
                                  return !isNaN(date.getTime()) ? format(date, "MMM dd, HH:mm") : "Unknown";
                                } catch {
                                  return "Unknown";
                                }
                              })()}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {suggestion.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateStatusMutation.mutate({ id: suggestion.id, status: "under_review" })}
                                      disabled={updateStatusMutation.isPending}
                                    >
                                      <Eye className="h-3 w-3 mr-1" />
                                      Review
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateStatusMutation.mutate({ id: suggestion.id, status: "approved" })}
                                      disabled={updateStatusMutation.isPending}
                                    >
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Approve
                                    </Button>
                                  </>
                                )}
                                {suggestion.status === "under_review" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateStatusMutation.mutate({ id: suggestion.id, status: "approved" })}
                                      disabled={updateStatusMutation.isPending}
                                    >
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => updateStatusMutation.mutate({ id: suggestion.id, status: "rejected" })}
                                      disabled={updateStatusMutation.isPending}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                                {suggestion.status === "approved" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateStatusMutation.mutate({ id: suggestion.id, status: "implemented" })}
                                    disabled={updateStatusMutation.isPending}
                                  >
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Mark Implemented
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
                  <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No suggestions found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
