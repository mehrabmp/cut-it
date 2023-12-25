import { type ShortLink } from "~/server/db/schema";

import { getBaseUrl } from "~/lib/utils";
import { Card, CardContent } from "~/components/ui/card";
import { Icons, iconVariants } from "~/components/ui/icons";

import { LinkCopyButton } from "./link-copy-button";
import { LinkViews } from "./link-views";

export const LinkCard = ({ slug, url, views }: ShortLink) => {
  const decodedURL = decodeURIComponent(url);
  const shortenedURL = `${getBaseUrl()}/${slug}`;

  return (
    <Card className="relative font-mono hover:border-foreground dark:hover:border-neutral-500 transition-colors">
      <CardContent className="flex flex-col gap-2 p-3">
        <div className="flex items-center gap-3 flex-wrap">
          <a
            href={shortenedURL}
            className="font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            {shortenedURL.split("://")[1]}
          </a>
          <div className="flex items-center gap-2">
            <LinkCopyButton textToCopy={shortenedURL} />
            <LinkViews views={views} />
          </div>
        </div>
        <div className="line-clamp-1 max-w-[320px] text-xs text-muted-foreground">
          <a href={decodedURL} target="_blank" rel="noopener noreferrer">
            {decodedURL}
          </a>
        </div>
      </CardContent>
      <Icons.MoreVertical
        className={iconVariants({
          className:
            "absolute right-2 top-[50%] translate-y-[-50%] cursor-pointer opacity-50 transition-opacity hover:opacity-100",
        })}
      />
    </Card>
  );
};
