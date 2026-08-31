import * as React from "react";
import { cn } from "@/lib/utils/cn";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[140px] w-full rounded-md border border-hairline/30 bg-elevated/40 px-4 py-3 text-sm text-ink placeholder:text-ink-subtle",
        "transition-colors focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30",
        "resize-y disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
