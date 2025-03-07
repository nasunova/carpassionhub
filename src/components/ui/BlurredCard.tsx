
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef, HTMLAttributes } from "react";

const blurredCardVariants = cva(
  "glass-card rounded-xl overflow-hidden transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "hover:shadow-xl",
        interactive: "hover:shadow-xl hover:-translate-y-1",
        solid: "bg-card shadow-md hover:shadow-lg",
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BlurredCardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof blurredCardVariants> {}

const BlurredCard = forwardRef<HTMLDivElement, BlurredCardProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(blurredCardVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

BlurredCard.displayName = "BlurredCard";

export { BlurredCard, blurredCardVariants };
