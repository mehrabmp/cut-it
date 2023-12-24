import { formatNumber } from "~/lib/utils";
import { Icons, iconVariants } from "~/components/ui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

type LinkViewsProps = {
  views: number;
};

export const LinkViews = ({ views }: LinkViewsProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex cursor-pointer items-center gap-1 transition-opacity opacity-50 hover:opacity-100">
          <Icons.Eye
            className={iconVariants({ size: "sm" })}
            aria-label="Total views"
          />
          <span className="text-xs">
            {formatNumber(views, { notation: "compact" })}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-sans">
          {formatNumber(views, { notation: "standard" })} Total views
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
