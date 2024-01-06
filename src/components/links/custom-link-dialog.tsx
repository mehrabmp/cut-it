"use client";

import React, { useState } from "react";
import { type ShortLink } from "~/server/db/schema";

import { useMediaQuery } from "~/hooks/use-media-query";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { CustomLinkButton } from "~/components/links/custom-link-button";
import { CustomLinkForm } from "~/components/links/custom-link-form";

type CustomLinkDialogProps = (
  | {
      isEditing: boolean;
      defaultValues: ShortLink;
    }
  | {
      isEditing?: undefined;
      defaultValues?: undefined;
    }
) &
  (
    | {
        open: boolean;
        onOpenChange: (isOpen: boolean) => void;
      }
    | {
        open?: undefined;
        onOpenChange?: undefined;
      }
  );

export const CustomLinkDialog = ({
  open = false,
  onOpenChange,
  defaultValues,
  isEditing = false,
}: CustomLinkDialogProps) => {
  const [isOpen, setIsOpen] = useState(open);
  const isControlled = onOpenChange !== undefined;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleOpenChange = (isOpen: boolean) => {
    if (!isControlled) {
      setIsOpen(isOpen);
    }
    onOpenChange?.(isOpen);
  };

  const openState = isControlled ? open : isOpen;

  if (isDesktop) {
    return (
      <Dialog open={openState} onOpenChange={handleOpenChange}>
        {!isEditing && (
          <DialogTrigger asChild>
            <CustomLinkButton />
          </DialogTrigger>
        )}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit link" : "Create a new link"}
            </DialogTitle>
          </DialogHeader>
          <div className="pt-4">
            <CustomLinkForm
              onSetIsDialogOpen={handleOpenChange}
              defaultValues={defaultValues}
              isEditing={isEditing}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={openState} onOpenChange={handleOpenChange}>
      {!isEditing && (
        <DrawerTrigger asChild>
          <CustomLinkButton />
        </DrawerTrigger>
      )}
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {isEditing ? "Edit link" : "Create a new link"}
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pt-4">
          <CustomLinkForm
            onSetIsDialogOpen={handleOpenChange}
            defaultValues={defaultValues}
            isEditing={isEditing}
          />
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
