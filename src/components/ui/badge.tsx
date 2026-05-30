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
        variant === "default" && "bg-accent/20 text-accent border border-accent/30",
        variant === "secondary" && "bg-foreground/10 text-foreground/70 border border-foreground/10",
        variant === "success" && "bg-accent/20 text-accent border border-accent/30",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
