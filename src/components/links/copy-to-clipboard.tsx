"use client";

import { toast } from "sonner";

import { Icons, iconVariants } from "~/components/ui/icons";

type CopyToClipboardProps = {
  textToCopy: string;
};

export const CopyToClipboard = ({ textToCopy }: CopyToClipboardProps) => {
  const handleOnCopy = async () => {
    await navigator.clipboard.writeText(textToCopy);
    toast("Copied to clipboard");
  };

  return (
    <div className="cursor-pointer transition-colors hover:text-foreground">
      <Icons.Copy
        className={iconVariants({ size: "sm" })}
        onClick={handleOnCopy}
      />
    </div>
  );
};
