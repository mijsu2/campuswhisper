import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Home, 
  MessageSquare, 
  Lightbulb, 
  Search, 
  CheckCircle, 
  HelpCircle, 
  GraduationCap,
  Menu,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

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

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm" data-testid="topbar">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer group">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <GraduationCap className="text-white h-5 w-5" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Campus Voice
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Anonymous Feedback</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                      isActive 
                        ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shadow-sm" 
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    )}
                    data-testid={`nav-${item.name.toLowerCase().replace(/\\s+/g, '-')}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:block">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Dropdown */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center space-x-1 px-3 py-2"
                  data-testid="mobile-menu-trigger"
                >
                  <Menu className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 mt-2"
                sideOffset={4}
              >
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  
                  return (
                    <Link key={item.name} href={item.href}>
                      <DropdownMenuItem
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2.5 cursor-pointer",
                          isActive 
                            ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300" 
                            : "text-gray-600 dark:text-gray-300"
                        )}
                        data-testid={`mobile-nav-${item.name.toLowerCase().replace(/\\s+/g, '-')}`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{item.name}</span>
                      </DropdownMenuItem>
                    </Link>
                  );
                })}
                
                {/* Dropdown Footer */}
                <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    🔒 Secure & Anonymous
                  </p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}