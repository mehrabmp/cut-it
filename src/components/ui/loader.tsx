import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const loaderVariants = cva(
  "animate-spin rounded-full border-solid border-white/10 border-l-white",
  {
    variants: {
      size: {
        default: "w-7 h-7 border-4",
        sm: "w-4 h-4 border-[3px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface LoaderProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof loaderVariants> {}

export const Loader = ({ className, size, ...props }: LoaderProps) => {
  return (
    <div className={cn(loaderVariants({ size, className }))} {...props}></div>
  );
};
