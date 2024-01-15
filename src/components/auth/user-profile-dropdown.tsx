"use client";

import { useState } from "react";
import { type UserWithLink } from "~/types";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Icons, iconVariants } from "~/components/ui/icons";
import { Loader } from "~/components/ui/loader";

import { UserProfileDialog } from "./user-profile-dialog";

type UserProfileDropdownProps = {
  user: UserWithLink;
};

export const UserProfileDropdown = ({ user }: UserProfileDropdownProps) => {
  const [isSignoutLoading, setIsSignoutLoading] = useState(false);
  const [isUserProfileDialogOpen, setIsUserProfileDialogOpen] = useState(false);

  const nameInitials = user.name
    ?.match(/\b(\w)/g)
    ?.join("")
    .slice(0, 2);

  const handleSignOut = async (e: Event) => {
    e.preventDefault();
    setIsSignoutLoading(true);
    await signOut();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-full" size="icon" variant="ghost">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.image ?? ""} alt="user profile image" />
              <AvatarFallback>{nameInitials}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-52">
          <div className="flex p-1">
            <div className="relative">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.image ?? ""} alt="user profile image" />
                <AvatarFallback>{nameInitials}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-[-1px] end-[-1px] bg-background p-0.5 rounded-full">
                <div className="bg-blue-500 rounded-full p-1"></div>
              </div>
            </div>
            <div className="ms-2 max-w-40">
              <div className="text-sm truncate font-medium">{user.name}</div>
              <div className="text-xs truncate text-muted-foreground">
                {user.email}
              </div>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsUserProfileDialogOpen(true)}>
              <Icons.User className={iconVariants({ className: "me-2" })} />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icons.Settings className={iconVariants({ className: "me-2" })} />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={handleSignOut}
            disabled={isSignoutLoading}
          >
            {isSignoutLoading ? (
              <>
                <Loader className="me-2" />
                Logging out...
              </>
            ) : (
              <>
                <Icons.LogOut className={iconVariants({ className: "me-2" })} />
                Logout
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UserProfileDialog
        user={user}
        isOpen={isUserProfileDialogOpen}
        onOpenChange={setIsUserProfileDialogOpen}
      />
    </>
  );
};
