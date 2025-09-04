import { Link } from "wouter";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-4 px-6" data-testid="footer">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          <p>&copy; 2024 Campus Voice. All rights reserved.</p>
        </div>
        <div className="flex items-center space-x-4">
          <span>Secure & Anonymous</span>
          <Link href="/admin/login">
            <div className="flex items-center space-x-1 hover:text-foreground transition-colors cursor-pointer" data-testid="admin-access-link">
              <Shield className="h-3 w-3" />
              <span className="text-xs">Admin Access</span>
            </div>
          </Link>
        </div>
      </div>
    </footer>
  );
}