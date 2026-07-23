import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-surface p-6 shadow-soft sm:p-8",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("space-y-3", className)} {...props} />;
}

type CardTitleProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
};

export function CardTitle<T extends ElementType = "h2">({
  as,
  children,
  className,
}: CardTitleProps<T>) {
  const Component = as ?? "h2";

  return (
    <Component
      className={cn("text-3xl font-semibold tracking-tight text-balance sm:text-4xl", className)}
    >
      {children}
    </Component>
  );
}

export function CardContent({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("mt-5", className)} {...props} />;
}
