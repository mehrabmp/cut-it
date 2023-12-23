import Link from "next/link";

import { getBaseUrl } from "~/lib/utils";
import { Card, CardContent } from "~/components/ui/card";
import { Icons, iconVariants } from "~/components/ui/icons";

import { CopyToClipboard } from "./copy-to-clipboard";
import { LinkViewCount } from "./link-view-count";

export const LinkCard = ({ slug, url, viewCount }: Link) => {
  const decodedURL = decodeURIComponent(url);
  const shortenedURL = `${getBaseUrl()}/${slug}`;

  return (
    <Card className="relative font-mono hover:border-foreground dark:hover:border-neutral-500 transition-colors">
      <CardContent className="flex flex-col gap-2 p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={shortenedURL}
            className="font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            {shortenedURL.split("://")[1]}
          </Link>
          <div className="flex items-center gap-2 text-neutral-500">
            <CopyToClipboard textToCopy={shortenedURL} />
            <LinkViewCount viewCount={viewCount} />
          </div>
        </div>
        <div className="line-clamp-1 max-w-[320px] text-xs text-neutral-500">
          <Link href={decodedURL} target="_blank" rel="noopener noreferrer">
            {decodedURL}
          </Link>
        </div>
      </CardContent>
      <Icons.MoreVertical
        className={iconVariants({
          className:
            "absolute right-2 top-[50%] translate-y-[-50%] cursor-pointer text-neutral-500 transition-colors hover:text-foreground",
        })}
      />
    </Card>
  );
};
