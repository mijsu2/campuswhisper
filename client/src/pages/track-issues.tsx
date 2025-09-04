import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IssueCard from "@/components/issue-card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Complaint } from "@shared/schema";
import { STATUS_OPTIONS, CATEGORIES } from "@/lib/constants";

export default function TrackIssues() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const { data: complaints = [], isLoading } = useQuery<Complaint[]>({
    queryKey: ["/api/complaints"],
  });

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch = searchTerm === "" || 
      complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "" || statusFilter === "all" || complaint.status === statusFilter;
    const matchesCategory = categoryFilter === "" || categoryFilter === "all" || complaint.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="page-container" data-testid="track-issues-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Track Submissions</h1>
        <p className="text-muted-foreground">Monitor the status of reported issues and suggestions</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by reference ID, subject, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-status-filter">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card p-6 rounded-lg border border-border animate-pulse">
                <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : filteredComplaints.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No submissions found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter || categoryFilter 
                  ? "Try adjusting your search criteria or filters"
                  : "No submissions have been made yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredComplaints.map((complaint) => (
            <IssueCard key={complaint.id} complaint={complaint} />
          ))
        )}
      </div>

      {/* Results Summary */}
      {filteredComplaints.length > 0 && (
        <div className="mt-8">
          <p className="text-sm text-muted-foreground text-center">
            Showing {filteredComplaints.length} of {complaints.length} results
          </p>
        </div>
      )}
    </div>
  );
}
