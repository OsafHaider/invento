"use client";

import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    { label, error, type = "text", showPassword, onTogglePassword, ...props },
    ref
  ) => {
    const isPasswordField = type === "password" || type === "text";
    const inputType = showPassword ? "text" : type;

    return (
      <div className="space-y-2">
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <div className="relative">
          <Input
            ref={ref}
            type={inputType}
            {...props}
            aria-invalid={!!error}
            className={error ? "border-red-500" : ""}
          />
          {isPasswordField && onTogglePassword && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1 text-muted-foreground hover:text-foreground"
              onClick={onTogglePassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
