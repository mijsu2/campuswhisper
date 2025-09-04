
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Clock, Calendar, User, Filter, Search, TrendingUp, Award, Target } from "lucide-react";
import { format } from "date-fns";
import { Complaint } from "@shared/schema";
import { CATEGORIES } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ResolvedCases() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: allComplaints = [], isLoading } = useQuery<Complaint[]>({
    queryKey: ["/api/complaints"],
  });

  const resolvedComplaints = allComplaints.filter(complaint => complaint.status === "resolved");
  const recentResolved = resolvedComplaints.slice(0, 3);
  
  // Filter resolved complaints based on search term
  const filteredComplaints = resolvedComplaints.filter(complaint =>
    complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (complaint.resolution && complaint.resolution.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate some metrics
  const totalResolved = resolvedComplaints.length;
  const avgResolutionTime = resolvedComplaints.length > 0 
    ? resolvedComplaints.reduce((acc, complaint) => {
        if (complaint.resolvedAt && complaint.createdAt) {
          const created = new Date(complaint.createdAt);
          const resolved = complaint.resolvedAt && typeof complaint.resolvedAt === 'object' && 'seconds' in complaint.resolvedAt
            ? new Date((complaint.resolvedAt as any).seconds * 1000)
            : new Date(complaint.resolvedAt);
          const days = Math.max(0, (resolved.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
          return acc + days;
        }
        return acc;
      }, 0) / resolvedComplaints.length
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="page-container py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" data-testid="resolved-cases-page">
      <div className="page-container py-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Resolved Cases
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore successfully resolved complaints and their comprehensive solutions
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Total Resolved</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">{totalResolved}</p>
                  <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">Successfully completed</p>
                </div>
                <div className="h-12 w-12 bg-green-100 dark:bg-green-800/30 rounded-xl flex items-center justify-center">
                  <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Avg Resolution Time</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{avgResolutionTime.toFixed(1)}</p>
                  <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">days average</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-800/30 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Success Rate</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                    {allComplaints.length > 0 ? Math.round((totalResolved / allComplaints.length) * 100) : 0}%
                  </p>
                  <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">resolution efficiency</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 dark:bg-purple-800/30 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Success Stories */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-8">
            <div className="h-8 w-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Featured Success Stories</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {recentResolved.length > 0 ? (
              recentResolved.map((complaint, index) => {
                const category = CATEGORIES.find(c => c.id === complaint.category);
                
                return (
                  <Card key={complaint.id} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-slate-800/50 backdrop-blur-sm" data-testid={`success-story-${complaint.referenceId}`}>
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="h-10 w-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                          <CheckCircle className="text-white h-5 w-5" />
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 font-medium">
                          Success Story #{index + 1}
                        </Badge>
                      </div>
                      
                      <h3 className="font-bold text-foreground mb-3 text-lg leading-tight">{complaint.subject}</h3>
                      
                      <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                        {complaint.resolution || "This case was successfully resolved with comprehensive attention to all stakeholder concerns."}
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-2" />
                          <span>Resolved: {(() => {
                            if (!complaint.resolvedAt) return "Recently";
                            try {
                              let date;
                              if (complaint.resolvedAt && typeof complaint.resolvedAt === 'object' && 'seconds' in complaint.resolvedAt) {
                                const timestamp = complaint.resolvedAt as any;
                                date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
                              } else {
                                date = new Date(complaint.resolvedAt);
                              }
                              return !isNaN(date.getTime()) ? format(date, "MMM dd, yyyy") : "Recently";
                            } catch {
                              return "Recently";
                            }
                          })()}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {category?.name || "General"}
                          </Badge>
                          <span className="text-xs font-mono text-muted-foreground">
                            #{complaint.referenceId.slice(-6)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="lg:col-span-3">
                <Card className="border-0 shadow-xl bg-white dark:bg-slate-800/50 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">Ready for Success Stories</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Once complaints are resolved, they'll be showcased here as inspiring success stories
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Comprehensive Resolution Archive */}
        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800/50 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-t-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <CardTitle className="text-2xl font-bold text-foreground">Resolution Archive</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search resolved cases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64 bg-white dark:bg-slate-800"
                  />
                </div>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {filteredComplaints.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                      <TableHead className="font-semibold text-foreground py-4">Issue Details</TableHead>
                      <TableHead className="font-semibold text-foreground">Category</TableHead>
                      <TableHead className="font-semibold text-foreground">Resolution Summary</TableHead>
                      <TableHead className="font-semibold text-foreground">Completion Date</TableHead>
                      <TableHead className="font-semibold text-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComplaints.map((complaint) => {
                      const category = CATEGORIES.find(c => c.id === complaint.category);
                      
                      return (
                        <TableRow key={complaint.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors" data-testid={`resolved-row-${complaint.referenceId}`}>
                          <TableCell className="py-6">
                            <div className="space-y-2">
                              <div className="font-semibold text-foreground text-sm">{complaint.subject}</div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs font-mono">
                                  #{complaint.referenceId.slice(-8)}
                                </Badge>
                                <div className="flex items-center text-xs text-green-600">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  <span>Resolved</span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                              {category?.name || "General"}
                            </Badge>
                          </TableCell>
                          
                          <TableCell className="max-w-xs">
                            <div className="text-sm text-foreground line-clamp-2 leading-relaxed">
                              {complaint.resolution || "Comprehensive resolution provided with full stakeholder satisfaction."}
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-2" />
                              <span>
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
                              </span>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30"
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
              <div className="text-center py-16">
                <div className="h-20 w-20 bg-green-100 dark:bg-green-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {searchTerm ? "No matching resolved cases" : "Building Success Stories"}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                  {searchTerm 
                    ? "Try adjusting your search terms to find specific resolved cases"
                    : "As complaints are successfully resolved, they'll be archived here as proof of our commitment to excellence"
                  }
                </p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm("")}
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
