import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/auth-context";
import PasswordChangeModal from "@/components/password-change-modal";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Shield,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const adminNavigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "All Complaints", href: "/admin/complaints", icon: FileText },
  { name: "Suggestions", href: "/admin/suggestions", icon: Lightbulb },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Users", href: "/admin/users", icon: Users },
];

export default function AdminTopbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm" data-testid="admin-topbar">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Admin Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <div className="flex items-center space-x-3 cursor-pointer group">
                <div className="h-10 w-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <Shield className="text-white h-5 w-5" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Admin Panel
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Campus Voice Management</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {adminNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer relative group",
                      isActive 
                        ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 shadow-sm border border-red-200 dark:border-red-800" 
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:shadow-sm"
                    )}
                    data-testid={`admin-nav-${item.name.toLowerCase().replace(/\\s+/g, '-')}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:block">{item.name}</span>
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-600 rounded-full"></div>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Admin Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="h-8 w-8 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-sm">
                <div className="text-gray-900 dark:text-white font-medium">
                  Welcome, {user?.username}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Administrator</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <PasswordChangeModal>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  data-testid="admin-change-password"
                  title="Change Password"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </PasswordChangeModal>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-9 w-9 p-0 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                onClick={handleLogout}
                data-testid="admin-logout"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2"
                  data-testid="admin-mobile-menu-trigger"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open admin menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[300px]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                      <Shield className="text-white h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-white">Admin Panel</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Campus Voice Management</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* User Info */}
                <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg border border-red-100 dark:border-red-800">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user?.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.username}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-1 mb-6">
                  {adminNavigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location === item.href;
                    
                    return (
                      <Link key={item.name} href={item.href}>
                        <div
                          className={cn(
                            "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer relative",
                            isActive 
                              ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800" 
                              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                          data-testid={`admin-mobile-nav-${item.name.toLowerCase().replace(/\\s+/g, '-')}`}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          <span className="flex-1">{item.name}</span>
                          {isActive && (
                            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile Admin Actions */}
                <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <PasswordChangeModal>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      data-testid="admin-mobile-change-password"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </PasswordChangeModal>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleLogout}
                    data-testid="admin-mobile-logout"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>

                {/* Mobile Footer */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-xs text-red-600 dark:text-red-400 text-center">
                      🛡️ Secure Admin Environment
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}