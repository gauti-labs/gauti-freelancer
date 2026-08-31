import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Hexagon({
  className,
  children,
  size = 48,
}: {
  className?: string;
  children?: React.ReactNode;
  size?: number;
}) {
  return (
    <div
      className={cn("relative inline-flex items-center justify-center text-gold", className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0" aria-hidden>
        <polygon
          points="50,4 92,28 92,72 50,96 8,72 8,28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <polygon
          points="50,14 84,33 84,67 50,86 16,67 16,33"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.2"
        />
      </svg>
      <span className="relative z-10">{children}</span>
    </div>
  );
}
