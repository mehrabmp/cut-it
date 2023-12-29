"use client";

import { useState } from "react";
import { type User } from "next-auth";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Loader } from "~/components/ui/loader";

type UserProfileDropdownProps = {
  user: User;
};

export const UserProfileDropdown = ({ user }: UserProfileDropdownProps) => {
  const [isSignoutLoading, setIsSignoutLoading] = useState(false);

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
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleSignOut} disabled={isSignoutLoading}>
          {isSignoutLoading ? (
            <>
              <Loader className="me-2" />
              Signing out...
            </>
          ) : (
            "Sign out"
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
