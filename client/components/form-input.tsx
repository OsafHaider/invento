import React from "react";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-3 py-2 border rounded-md text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50",
            error
              ? "border-destructive focus:ring-destructive/50"
              : "border-input focus:border-primary",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
