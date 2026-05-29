import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "secondary" | "success";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variant === "default" && "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
        variant === "secondary" && "bg-white/10 text-white/70 border border-white/10",
        variant === "success" && "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
