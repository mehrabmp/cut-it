"use client";

import React from "react";
import { type BuiltInProviderType } from "next-auth/providers/index";
import { signIn, type LiteralUnion } from "next-auth/react";
import { useTheme } from "next-themes";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import { OAuthProviderButton } from "./oauth-provider-button";

export const SigninDialog = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();

  const [signinProvider, setSigninProvider] =
    React.useState<LiteralUnion<BuiltInProviderType>>();

  const handleSignin = async (provider: LiteralUnion<BuiltInProviderType>) => {
    setSigninProvider(provider);
    await signIn(provider);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[22rem] sm:max-w-sm">
        <DialogHeader className="space-y-4">
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>
            Sign in for unlimited link lifespan and extra options.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-4">
          <OAuthProviderButton
            provider="google"
            providerName="Google"
            isLoading={signinProvider === "google"}
            handleSignin={handleSignin}
            variant={theme === "dark" ? "default" : "secondary"}
          />
          <OAuthProviderButton
            provider="github"
            providerName="GitHub"
            isLoading={signinProvider === "github"}
            handleSignin={handleSignin}
            variant={theme === "dark" ? "secondary" : "default"}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
