"use client";

import * as React from "react";
import { type ShortLink } from "~/server/db/schema";
import { type Session } from "next-auth";

import { cn } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Icons, iconVariants } from "~/components/ui/icons";
import { CustomLinkDialog } from "~/components/links/custom-link-dialog";
import { DeleteLinkDialog } from "~/components/links/delete-link-dialog";
import { LinkQRCodeDialog } from "~/components/links/link-qrcode-dialog";

const LinkOptionsDropdown = React.forwardRef<
  React.ElementRef<typeof DropdownMenuTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuTrigger> & {
    link: ShortLink;
    session?: Session | null;
  }
>(({ link, session, className, disabled, ...props }, ref) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isEditLinkDialogOpen, setIsEditLinkDialogOpen] = React.useState(false);
  const [isLinkQRCodeDialogOpen, setIsLinkQRCodeDialogOpen] =
    React.useState(false);

  const decodedURL = decodeURIComponent(link.url);

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
            onClick={() => setIsLinkQRCodeDialogOpen(true)}
            disabled={disabled}
          >
            <Icons.QrCode className={iconVariants({ className: "mr-2" })} />
            QR Code
          </DropdownMenuItem>
          {session && (
            <DropdownMenuItem
              onClick={() => setIsEditLinkDialogOpen(true)}
              disabled={disabled}
            >
              <Icons.Pencil className={iconVariants({ className: "mr-2" })} />
              Edit
            </DropdownMenuItem>
          )}
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
      <DeleteLinkDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        slug={link.slug}
      />
      <CustomLinkDialog
        open={isEditLinkDialogOpen}
        onOpenChange={setIsEditLinkDialogOpen}
        defaultValues={link}
        isEditing
      />
      <LinkQRCodeDialog
        isOpen={isLinkQRCodeDialogOpen}
        onOpenChange={setIsLinkQRCodeDialogOpen}
        url={decodedURL}
        slug={link.slug}
      />
    </>
  );
});
LinkOptionsDropdown.displayName = "LinkOptionsDropdown";

export { LinkOptionsDropdown };
