import { Link } from "wouter";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6" data-testid="footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">&copy; 2024 Campus Voice. All rights reserved.</p>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Secure & Anonymous</span>
            </span>
            <Link href="/admin/login">
              <div className="flex items-center space-x-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-xs" data-testid="admin-access-link">
                <Shield className="h-3 w-3" />
                <span>Admin Access</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}