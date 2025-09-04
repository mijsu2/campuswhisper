import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div className="floating-label">
        <input
          ref={ref}
          placeholder=" "
          className={cn(
            "w-full px-4 py-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors",
            className
          )}
          {...props}
        />
        <label>{label}</label>
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export const FloatingTextarea = forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div className="floating-label">
        <textarea
          ref={ref}
          placeholder=" "
          className={cn(
            "w-full px-4 py-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors resize-none",
            className
          )}
          {...props}
        />
        <label>{label}</label>
      </div>
    );
  }
);

FloatingTextarea.displayName = "FloatingTextarea";
