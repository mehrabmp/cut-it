import { deleteShortLink } from "~/server/actions/link";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

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

type DeleteLinkDialogProps = {
  slug: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

export const DeleteLinkDialog = ({
  slug,
  isOpen,
  onOpenChange,
}: DeleteLinkDialogProps) => {
  const { execute: deleteLink, status: deleteLinkStatus } = useAction(
    deleteShortLink,
    {
      onSuccess() {
        toast.info("Link deleted successfully");
        onOpenChange?.(false);
      },
      onError(error) {
        toast.error(error.serverError ?? error.fetchError);
      },
    },
  );

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[22rem] sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the link.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => deleteLink({ slug })}
            isLoading={deleteLinkStatus === "executing"}
          >
            {deleteLinkStatus === "executing"
              ? "Deleting link..."
              : "Delete link"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
