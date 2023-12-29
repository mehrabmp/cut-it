import * as React from "react";
import { type BuiltInProviderType } from "next-auth/providers/index";
import { type LiteralUnion } from "next-auth/react";

import { cn } from "~/lib/utils";
import { Button, type ButtonVariant } from "~/components/ui/button";
import { Icons, iconVariants, type Icon } from "~/components/ui/icons";

const OAuthProviderButton = React.forwardRef<
  React.ElementRef<"button">,
  React.ComponentPropsWithoutRef<"button"> & {
    provider: LiteralUnion<BuiltInProviderType>;
    providerName: string;
    handleSignin: (provider: LiteralUnion<BuiltInProviderType>) => void;
    variant?: ButtonVariant["variant"];
    isLoading: boolean;
  }
>(
  (
    {
      variant,
      provider,
      providerName,
      isLoading,
      handleSignin,
      className,
      ...props
    },
    ref,
  ) => {
    const ProviderIcon = Icons[provider as keyof typeof Icons] as Icon;
    return (
      <Button
        className={cn(className)}
        onClick={() => handleSignin(provider)}
        variant={variant}
        isLoading={isLoading}
        ref={ref}
        {...props}
      >
        {!isLoading && (
          <ProviderIcon className={iconVariants({ className: "mr-2" })} />
        )}
        {isLoading
          ? `Redirecting to ${providerName}...`
          : `Continue with ${providerName}`}
      </Button>
    );
  },
);
OAuthProviderButton.displayName = "OAuthProviderButton";

export { OAuthProviderButton };
