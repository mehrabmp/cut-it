import Image from "next/image";
import { type ShortLink } from "~/server/db/schema";
import { formatDistanceToNowStrict } from "date-fns";

import { formatNumber, getBaseUrl } from "~/lib/utils";
import { Card, CardContent } from "~/components/ui/card";
import { Icons, iconVariants } from "~/components/ui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { LinkCopyButton } from "~/components/links/link-copy-button";
import { LinkOptionsDropdown } from "~/components/links/link-options-dropdown";

export const LinkCard = (link: ShortLink) => {
  const { slug, url, views } = link;
  const decodedURL = decodeURIComponent(url);
  const shortenedURL = `${getBaseUrl()}/${slug}`;

  return (
    <Card className="relative font-mono hover:border-foreground dark:hover:border-neutral-500 transition-colors">
      <CardContent className="flex gap-2 p-3">
        <div className="flex flex-col justify-center">
          <Image
            src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${
              new URL(decodedURL).origin
            }&size=64`}
            className="rounded-full"
            alt="link favicon"
            width={32}
            height={32}
            quality={100}
          />
        </div>
        <div className="flex flex-col gap-2">
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="flex cursor-pointer items-center gap-1 transition-opacity opacity-50 hover:opacity-100"
                    type="button"
                  >
                    <Icons.Eye
                      className={iconVariants({ size: "sm" })}
                      aria-label="Total views"
                    />
                    <span className="text-xs">
                      {formatNumber(views, { notation: "compact" })}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-sans">
                    {formatNumber(views, { notation: "standard" })} Total views
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="truncate max-w-52 sm:max-w-64 w-full text-xs text-muted-foreground">
            <a href={decodedURL} target="_blank" rel="noopener noreferrer">
              {decodedURL}
            </a>
          </div>
        </div>
      </CardContent>
      <LinkOptionsDropdown className="absolute right-2 top-3" link={link} />
      <span className="absolute right-3 bottom-3 text-[10px] text-muted-foreground font-medium">
        <Tooltip>
          <TooltipTrigger>
            {formatDistanceToNowStrict(new Date(link.createdAt), {
              addSuffix: true,
            })}
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-sans">
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "long",
                timeStyle: "short",
              }).format(new Date(link.createdAt))}
            </p>
          </TooltipContent>
        </Tooltip>
      </span>
    </Card>
  );
};
