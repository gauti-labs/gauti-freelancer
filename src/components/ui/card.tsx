import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-hairline/25 bg-elevated/60 p-8",
        "backdrop-blur-sm transition-colors hover:border-gold/40",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
