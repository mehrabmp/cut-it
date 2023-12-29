import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

import { iconVariants, type IconVariants } from "./icons";

const loaderVariants = cva("animate-spin rounded-full border-solid", {
  variants: {
    variant: {
      default: "border-muted border-l-foreground",
      primary: "border-primary-foreground/20 border-l-primary-foreground",
      destructive:
        "border-destructive-foreground/20 border-l-destructive-foreground",
      secondary: "border-secondary-foreground/20 border-l-secondary-foreground",
    },
    border: {
      xs: "border-[3px]",
      sm: "border-[3px]",
      base: "border-[3px]",
      lg: "border-4",
      xl: "border-4",
      "2xl": "border-4",
      "3xl": "border-[5px]",
      "4xl": "border-[6px]",
      "5xl": "border-[6px]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type LoaderVariant = VariantProps<typeof loaderVariants>;

const Loader = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & LoaderVariant & IconVariants
>(({ variant, size = "base", className, ...props }, ref) => (
  <div
    className={cn(
      loaderVariants({ variant, border: size, className }),
      iconVariants({ size }),
    )}
    ref={ref}
    {...props}
  />
));
Loader.displayName = "Loader";

export { Loader };
