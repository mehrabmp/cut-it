import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const headingVariants = cva("text-balance font-semibold", {
  variants: {
    variant: {
      h1: "mb-1 mt-[2em] text-4xl font-bold",
      h2: "mb-px mt-[1.4em] text-2xl tracking-tight",
      h3: "mb-px mt-[1em] text-xl tracking-tight",
      h4: "mt-[0.75em] text-lg tracking-tight",
      h5: "mt-[0.75em] text-lg tracking-tight",
      h6: "mt-[0.75em] text-base tracking-tight",
    },
    isFirstBlock: {
      true: "mt-0",
      false: "",
    },
  },
});

const Heading = React.forwardRef<
  React.ElementRef<"h1">,
  React.ComponentPropsWithRef<"h1"> & VariantProps<typeof headingVariants>
>(({ className, variant, isFirstBlock, ...props }, ref) => {
  const Element = variant!;

  return (
    <Element
      className={cn(headingVariants({ variant, isFirstBlock, className }))}
      ref={ref}
      {...props}
    />
  );
});
Heading.displayName = "Heading";

export { Heading, headingVariants };
