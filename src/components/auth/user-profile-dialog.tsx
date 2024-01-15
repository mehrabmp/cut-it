import { type UserWithLink } from "~/types";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Icons, iconVariants } from "~/components/ui/icons";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "~/components/ui/responsive-dialog";
import { Separator } from "~/components/ui/separator";

type UserProfileDialogProps = {
  user: UserWithLink;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

export const UserProfileDialog = ({
  user,
  isOpen,
  onOpenChange,
}: UserProfileDialogProps) => {
  const nameInitials = user.name
    ?.match(/\b(\w)/g)
    ?.join("")
    .slice(0, 2);

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Profile</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <ResponsiveDialogBody className="flex flex-col gap-4 items-center">
          <Avatar className="h-28 w-28">
            <AvatarImage src={user.image ?? ""} alt="user profile image" />
            <AvatarFallback>{nameInitials}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <div className="text-medium">{user.name}</div>
            <div className="text-muted-foreground text-sm">{user.email}</div>
          </div>
          <div className="flex flex-col gap-3 p-4 text-sm w-full">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="flex justify-between items-center text-muted-foreground gap-2">
                  <Icons.Link className={iconVariants({ size: "sm" })} />
                  Total created links
                </div>
                <div>{user?.userLink?.totalLinks ?? 0}</div>
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="flex justify-between items-center text-muted-foreground gap-2">
                  <Icons.Calendar className={iconVariants({ size: "sm" })} />
                  Joined
                </div>
                <div>
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "full",
                  }).format(new Date(user.createdAt))}
                </div>
              </div>
            </div>
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
