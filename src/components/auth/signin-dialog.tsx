"use client";

import React from "react";
import { signIn } from "next-auth/react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Icons, iconVariants } from "~/components/ui/icons";

export const SigninDialog = ({ children }: { children: React.ReactNode }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader className="space-y-4">
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>
            Sign in for unlimited link lifespan and extra options.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-4">
          <Button onClick={() => signIn("google")}>
            <Icons.google className={iconVariants({ className: "mr-2" })} />
            Continue with Google
          </Button>
          <Button variant="secondary" onClick={() => signIn("github")}>
            <Icons.github className={iconVariants({ className: "mr-2" })} />
            Continue with Github
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
