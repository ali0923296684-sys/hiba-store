"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "outline";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variant === "default" && "bg-dark-700 text-luxury-cream/70",
        variant === "gold" && "bg-luxury-beige/20 text-luxury-beige border border-luxury-beige/30",
        variant === "outline" && "border border-luxury-beige/30 text-luxury-cream/60",
        className
      )}
    >
      {children}
    </span>
  );
}
