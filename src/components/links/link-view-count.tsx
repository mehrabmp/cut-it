import { formatNumber } from "~/lib/utils";
import { Icons, iconVariants } from "~/components/ui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

type LinkViewCountProps = {
  viewCount: number;
};

export const LinkViewCount = ({ viewCount }: LinkViewCountProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground">
          <Icons.Eye className={iconVariants({ size: "sm" })} />
          <span className="text-xs">
            {formatNumber(viewCount, { notation: "compact" })}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-sans">
          {formatNumber(viewCount, { notation: "standard" })} Total views
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
