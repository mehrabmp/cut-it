"use client";

import { CopyIcon, DotsVerticalIcon, EyeOpenIcon } from "@radix-ui/react-icons";
// import type { Link } from "~/server/db/schema";
import { toast } from "sonner";

import { Card, CardContent } from "~/components/ui/card";

export const LinkCard = ({ slug, url, viewCount }: Link) => {
  const decodedURL = decodeURIComponent(url);

  const shortLink = `${
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/"
      : "https://cutit.vercel.app/"
  }${slug}`;

  const handleOnCopy = async () => {
    await navigator.clipboard.writeText(shortLink);
    toast("Copied to clipboard");
  };

  return (
    <Card className="relative w-full">
      <CardContent className="space-y-1 p-3">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm">
            <a href={shortLink} target="_blank" rel="noopener noreferrer">
              {shortLink.split("://")[1]}
            </a>
          </h3>
          <div className="flex items-center space-x-2.5 text-neutral-500">
            <CopyIcon
              className="cursor-pointer transition-colors hover:text-foreground"
              onClick={handleOnCopy}
            />
            <div className="flex cursor-pointer items-center space-x-1 transition-colors hover:text-foreground">
              <EyeOpenIcon />
              <span className="text-xs">{viewCount}</span>
            </div>
          </div>
        </div>
        <h4 className="truncate pr-4 text-xs text-neutral-500">
          <a href={decodedURL} target="_blank" rel="noopener noreferrer">
            {decodedURL}
          </a>
        </h4>
      </CardContent>
      <DotsVerticalIcon className="absolute right-2 top-[50%] translate-y-[-50%] cursor-pointer text-neutral-500 transition-colors hover:text-foreground" />
    </Card>
  );
};
