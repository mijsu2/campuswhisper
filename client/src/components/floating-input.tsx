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
      <div className="relative">
        <input
          ref={ref}
          placeholder=" "
          className={cn(
            "peer w-full px-4 py-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors",
            className
          )}
          {...props}
        />
        <label className={cn(
          "absolute left-4 -top-2.5 px-2 text-sm font-medium",
          "bg-background text-muted-foreground",
          "transition-all duration-200 pointer-events-none",
          "peer-placeholder-shown:text-base peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:top-3 peer-placeholder-shown:-z-10",
          "peer-focus:text-sm peer-focus:text-primary peer-focus:-top-2.5 peer-focus:z-10"
        )}>{label}</label>
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export const FloatingTextarea = forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div className="relative">
        <textarea
          ref={ref}
          placeholder=" "
          className={cn(
            "w-full px-4 py-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors resize-none",
            className
          )}
          {...props}
        />
        <label className={cn(
          "absolute left-4 -top-2.5 px-2 text-sm font-medium",
          "bg-background text-muted-foreground",
          "transition-all duration-200 pointer-events-none",
          "peer-placeholder-shown:text-base peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:top-3 peer-placeholder-shown:-z-10",
          "peer-focus:text-sm peer-focus:text-primary peer-focus:-top-2.5 peer-focus:z-10"
        )}>{label}</label>
      </div>
    );
  }
);

FloatingTextarea.displayName = "FloatingTextarea";