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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" data-testid="track-issues-page">
      <div className="page-container py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 text-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-300 bg-clip-text text-transparent mb-2 sm:mb-3 leading-tight">
            Track Submissions
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Monitor the status of your reported issues and suggestions with real-time updates
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 sm:mb-8 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm mx-4">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
                <Input
                  placeholder="Search by reference ID, subject, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base border-2 border-muted focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  data-testid="input-search"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48 lg:w-52 h-10 sm:h-12 border-2 border-muted focus:border-blue-500 text-sm sm:text-base" data-testid="select-status-filter">
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
                  <SelectTrigger className="w-full sm:w-48 lg:w-52 h-10 sm:h-12 border-2 border-muted focus:border-blue-500 text-sm sm:text-base" data-testid="select-category-filter">
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
            </div>
          </CardContent>
        </Card>

        {/* Issues List with Scrollbar */}
        <div className="max-h-[70vh] overflow-y-auto space-y-4 sm:space-y-6 px-4 pr-2 sm:pr-2 custom-scrollbar">
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/60 dark:bg-slate-800/60 p-8 rounded-xl border-0 shadow-lg animate-pulse backdrop-blur-sm">
                  <div className="h-6 bg-muted rounded-lg w-1/2 mb-4"></div>
                  <div className="h-4 bg-muted rounded-lg w-1/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded-lg w-1/3"></div>
                </div>
              ))}
            </div>
          ) : filteredComplaints.length === 0 ? (
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900 dark:to-indigo-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">No submissions found</h3>
                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                  {searchTerm || statusFilter || categoryFilter 
                    ? "Try adjusting your search criteria or filters to find what you're looking for"
                    : "No submissions have been made yet. Your reports will appear here once submitted."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredComplaints.map((complaint) => (
              <IssueCard 
                key={complaint.id} 
                complaint={complaint} 
                hideCollapsible={true}
              />
            ))
          )}
        </div>

        {/* Results Summary */}
        {filteredComplaints.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/60 dark:bg-slate-800/60 rounded-full backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
              <p className="text-sm font-medium text-muted-foreground">
                Showing <span className="text-blue-600 dark:text-blue-400 font-semibold">{filteredComplaints.length}</span> of <span className="text-blue-600 dark:text-blue-400 font-semibold">{complaints.length}</span> results
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
