"use client";

import * as React from "react";
import { deleteShortLink } from "~/server/actions/link";
import { type ShortLink } from "~/server/db/schema";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { cn } from "~/lib/utils";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Icons, iconVariants } from "~/components/ui/icons";

const LinkOptionsDropdown = React.forwardRef<
  React.ElementRef<typeof DropdownMenuTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuTrigger> & {
    link: ShortLink;
  }
>(({ link, className, disabled, ...props }, ref) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const { execute: deleteLink, status: deleteLinkStatus } = useAction(
    deleteShortLink,
    {
      onSuccess() {
        toast.info("Link deleted successfully");
        setIsDeleteDialogOpen(false);
      },
      onError(error) {
        toast.error(error.serverError);
      },
    },
  );

  return (
    <>
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
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={disabled}
          >
            <Icons.Trash2 className={iconVariants({ className: "mr-2" })} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="max-w-[22rem] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              link.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => deleteLink({ slug: link.slug })}
              isLoading={deleteLinkStatus === "executing"}
            >
              {deleteLinkStatus === "executing"
                ? "Deleting link..."
                : "Delete link"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});
LinkOptionsDropdown.displayName = "LinkOptionsDropdown";

export { LinkOptionsDropdown };
