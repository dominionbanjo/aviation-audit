import * as React from "react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeSlash } from "iconsax-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  icon?: React.ReactNode;
  loading?: boolean;
}

export function FormInput({
  name,
  label,
  icon,
  loading,
  className,
  type,
  ...props
}: FormInputProps) {
  const { control } = useFormContext();
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="space-y-1.5">
          {label && (
            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative flex items-center group">
              {/* Left icon */}
              {icon && (
                <div className="absolute left-4 flex items-center justify-center text-muted-foreground pointer-events-none">
                  {icon}
                </div>
              )}

              <Input
                {...field}
                {...props}
                type={inputType}
                disabled={loading || props.disabled}
                className={cn(
                  // Base
                  "h-12 rounded-lg border-border bg-muted/40 text-sm font-medium",
                  "transition-all duration-200",
                  "focus-visible:ring-1 focus-visible:ring-foreground/30 focus-visible:border-foreground/40",
                  "placeholder:text-muted-foreground/50",
                  // Icon padding
                  icon ? "pl-11" : "pl-4",
                  // Password toggle padding
                  isPassword ? "pr-11" : "pr-4",
                  // Error state
                  fieldState.error && "border-destructive/60 focus-visible:ring-destructive/30",
                  className
                )}
              />

              {/* Right: password toggle */}
              {isPassword ? (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeSlash size={18} variant="Outline" color="currentColor" />
                  ) : (
                    <Eye size={18} variant="Outline" color="currentColor" />
                  )}
                </button>
              ) : null}
            </div>
          </FormControl>
          <FormMessage className="text-xs font-medium" />
        </FormItem>
      )}
    />
  );
}
