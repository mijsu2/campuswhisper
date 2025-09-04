
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  GraduationCap,
  Home,
  MessageSquare,
  Lightbulb,
  Search,
  CheckCircle,
  HelpCircle,
  Menu,
  Sparkles,
  Shield
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Submit Complaint", href: "/submit", icon: MessageSquare },
  { name: "Suggestions", href: "/suggestions", icon: Lightbulb },
  { name: "Track Issues", href: "/track", icon: Search },
  { name: "Resolved Cases", href: "/resolved", icon: CheckCircle },
  { name: "FAQ", href: "/faq", icon: HelpCircle },
];

export default function Topbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500 backdrop-blur-xl",
        scrolled 
          ? "bg-white/80 dark:bg-gray-900/80 shadow-2xl border-b border-gray-200/50 dark:border-gray-800/50" 
          : "bg-white/95 dark:bg-gray-900/95 shadow-lg border-b border-gray-200/20 dark:border-gray-800/20"
      )} 
      data-testid="topbar"
    >
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Enhanced Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <div className="flex items-center space-x-4 cursor-pointer group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-300 animate-pulse" />
                  <div className="relative h-12 w-12 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <GraduationCap className="text-white h-6 w-6" />
                    <div className="absolute top-1 right-1 h-2 w-2 bg-white/30 rounded-full animate-ping" />
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                      Campus Voice
                    </h1>
                    <div className="flex items-center space-x-1">
                      <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
                      <Badge variant="secondary" className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 border-0">
                        Premium
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                    <Shield className="h-3 w-3" />
                    <span>Anonymous & Secure Feedback</span>
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={cn(
                      "relative flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer group",
                      isActive 
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/25 scale-105" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:text-gray-900 dark:hover:text-white hover:shadow-lg hover:scale-105"
                    )}
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Icon className={cn(
                      "h-4 w-4 transition-all duration-300",
                      isActive ? "text-white" : "text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    )} />
                    <span className="hidden lg:block font-semibold">{item.name}</span>
                    
                    {/* Active indicator with glow effect */}
                    {isActive && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-50 animate-pulse" />
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg" />
                      </>
                    )}
                    
                    {/* Hover glow effect */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-xl transition-all duration-300" />
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Enhanced Mobile Menu */}
          <div className="flex items-center space-x-4 md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative h-12 w-12 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Menu className="h-5 w-5" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 hover:from-blue-500/10 hover:to-purple-500/10 rounded-xl transition-all duration-300" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-200/50 dark:border-gray-800/50"
              >
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Brand */}
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <GraduationCap className="text-white h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900 dark:text-white">Campus Voice</h2>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Premium Platform</p>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="space-y-2">
                    {navigation.map((item) => {
                      const Icon = item.icon;
                      const isActive = location === item.href;
                      
                      return (
                        <Link key={item.name} href={item.href}>
                          <div
                            className={cn(
                              "flex items-center space-x-3 px-4 py-4 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer border border-transparent",
                              isActive 
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg border-blue-200 dark:border-blue-800" 
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="font-semibold">{item.name}</span>
                            {isActive && (
                              <div className="ml-auto h-2 w-2 bg-white rounded-full animate-pulse" />
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
