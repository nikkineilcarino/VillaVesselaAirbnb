import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const variantClasses = {
  danger: "bg-danger text-white hover:brightness-90",
  ghost: "bg-transparent text-primary hover:bg-surface-muted",
  primary: "bg-primary text-white hover:bg-primary-dark",
  secondary:
    "border border-border bg-surface text-foreground hover:bg-surface-muted",
} as const;

const sizeClasses = {
  large: "min-h-12 px-7 py-3 text-base",
  medium: "min-h-11 px-6 py-2.5 text-sm",
  small: "min-h-10 px-4 py-2 text-sm",
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: keyof typeof sizeClasses;
  variant?: keyof typeof variantClasses;
};

export function Button({
  className,
  size = "medium",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-55",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
