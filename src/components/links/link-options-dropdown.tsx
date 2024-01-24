"use client";

import * as React from "react";
import { type ShortLink } from "~/server/db/schema";
import { type Session } from "next-auth";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Icons, iconVariants } from "~/components/ui/icons";
import { ProtectedElement } from "~/components/ui/protected-element";
import { CustomLinkDialog } from "~/components/links/custom-link-dialog";
import { DeleteLinkDialog } from "~/components/links/delete-link-dialog";
import { LinkQRCodeDialog } from "~/components/links/link-qrcode-dialog";

type LinkOptionsDropdownProps = {
  link: ShortLink;
  session?: Session | null;
};

export const LinkOptionsDropdown = ({
  link,
  session,
}: LinkOptionsDropdownProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isEditLinkDialogOpen, setIsEditLinkDialogOpen] = React.useState(false);
  const [isQRCodeDialogOpen, setIsQRCodeDialogOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="cursor-pointer transition-opacity absolute right-2 top-3 opacity-50 hover:opacity-100"
            type="button"
          >
            <Icons.MoreVertical className={iconVariants()} />
            <span className="sr-only">Link actions menu</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsQRCodeDialogOpen(true)}>
            <Icons.QrCode className={iconVariants({ className: "mr-2" })} />
            QR Code
          </DropdownMenuItem>
          <ProtectedElement
            session={session}
            tooltipMessage="Sign in to edit links"
            renderElement={(disabled) => (
              <DropdownMenuItem
                onClick={() => setIsEditLinkDialogOpen(true)}
                disabled={disabled}
              >
                <Icons.Pencil className={iconVariants({ className: "mr-2" })} />
                Edit
              </DropdownMenuItem>
            )}
          />
          <DropdownMenuItem
            className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={link.slug === "github"}
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
        isOpen={isQRCodeDialogOpen}
        onOpenChange={setIsQRCodeDialogOpen}
        url={link.url}
        slug={link.slug}
      />
    </>
  );
};
