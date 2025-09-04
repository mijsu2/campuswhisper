import { Shield } from "lucide-react";

export default function SecurityBanner() {
  return (
    <div className="bg-primary text-primary-foreground p-3 text-center relative" data-testid="security-banner">
      <div className="flex items-center justify-center space-x-2">
        <Shield className="h-4 w-4" />
        <span className="text-sm font-medium">
          🔒 All submissions are completely anonymous and confidential. Your privacy is our priority.
        </span>
      </div>
    </div>
  );
}
