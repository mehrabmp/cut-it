"use client";

import * as React from "react";

import { cn } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Icons, iconVariants } from "~/components/ui/icons";

const LinkOptionsDropdown = React.forwardRef<
  React.ElementRef<typeof DropdownMenuTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuTrigger>
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "cursor-pointer transition-opacity opacity-50 hover:opacity-100",
            className,
          )}
          aria-label="link actions menu"
          type="button"
          ref={ref}
          {...props}
        >
          <Icons.MoreVertical className={iconVariants()} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="text-red-400 focus:text-red-400 focus:bg-red-400/10">
          <Icons.Trash2 className={iconVariants({ className: "mr-2" })} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
LinkOptionsDropdown.displayName = "LinkOptionsDropdown";

export { LinkOptionsDropdown };
