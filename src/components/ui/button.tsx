import * as React from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium tracking-tight transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/60",
  {
    variants: {
      variant: {
        primary:
          "bg-gold-gradient text-[hsl(var(--bg-base))] shadow-[0_0_0_1px_hsl(var(--gold-primary)/0.3),0_20px_40px_-20px_hsl(var(--gold-primary)/0.4)] hover:shadow-[0_0_0_1px_hsl(var(--gold-primary)/0.6),0_30px_60px_-20px_hsl(var(--gold-primary)/0.6)] hover:-translate-y-px",
        secondary:
          "border border-gold/40 bg-transparent text-ink hover:border-gold/70 hover:bg-gold/5",
        ghost: "text-ink-muted hover:text-ink hover:bg-gold/5",
        outline:
          "border border-hairline/30 text-ink hover:border-gold/50 hover:text-gold",
      },
      size: {
        sm: "h-9 px-4 text-sm rounded-md",
        md: "h-11 px-6 text-sm rounded-md",
        lg: "h-14 px-8 text-base rounded-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = "Button";

type ButtonLinkProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants>;

export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
