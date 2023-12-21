import { cva, type VariantProps } from "class-variance-authority";
import { Copy, Eye, MoreVertical, Scissors } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconVariants = cva("", {
  variants: {
    size: {
      xs: "size-3",
      sm: "size-3.5",
      base: "size-4",
      lg: "size-5",
      xl: "size-6",
      "2xl": "size-7",
      "3xl": "size-8",
      "4xl": "size-9",
      "5xl": "size-10",
    },
  },
  defaultVariants: {
    size: "base",
  },
});

export type IconVariants = VariantProps<typeof iconVariants>;

export type Icon = LucideIcon;

const Icons = {
  MoreVertical,
  Scissors,
  Copy,
  Eye,
};

export { Icons, iconVariants };
