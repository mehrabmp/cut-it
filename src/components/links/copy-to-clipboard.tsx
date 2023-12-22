"use client";

import { toast } from "sonner";

import { Icons, iconVariants } from "~/components/ui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

type CopyToClipboardProps = {
  textToCopy: string;
};

export const CopyToClipboard = ({ textToCopy }: CopyToClipboardProps) => {
  const handleOnCopy = async () => {
    await navigator.clipboard.writeText(textToCopy);
    toast("Copied to clipboard");
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="cursor-pointer transition-colors hover:text-foreground">
          <Icons.Copy
            className={iconVariants({ size: "sm" })}
            onClick={handleOnCopy}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-sans">Copy link to clipboard</p>
      </TooltipContent>
    </Tooltip>
  );
};
