import { Shield } from "lucide-react";

export default function SecurityBanner() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4" data-testid="security-banner">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-center space-x-2">
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">
            🔒 All submissions are completely anonymous and confidential. Your privacy is our priority.
          </span>
        </div>
      </div>
    </div>
  );
}
