import { Link, useLocation } from "wouter";
import { 
  Home, 
  MessageSquare, 
  Lightbulb, 
  Search, 
  CheckCircle, 
  HelpCircle, 
  Settings,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Submit Complaint", href: "/submit", icon: MessageSquare },
  { name: "Suggestions", href: "/suggestions", icon: Lightbulb },
  { name: "Track Issues", href: "/track", icon: Search },
  { name: "Resolved Cases", href: "/resolved", icon: CheckCircle },
  { name: "FAQ", href: "/faq", icon: HelpCircle },
  { name: "Admin Panel", href: "/admin", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border shadow-sm" data-testid="sidebar">
      <div className="p-6">
        <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center mb-3">
          <GraduationCap className="text-primary-foreground text-xl" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Campus Voice</h2>
        <p className="text-sm text-muted-foreground">Anonymous Feedback System</p>
      </div>
      
      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <div
                    className={cn(
                      "nav-item w-full text-left px-3 py-2 flex items-center space-x-3 transition-all duration-200 cursor-pointer",
                      isActive 
                        ? "bg-primary text-primary-foreground rounded-md" 
                        : "text-foreground hover:bg-accent hover:rounded-md"
                    )}
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
