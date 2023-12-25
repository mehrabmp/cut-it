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
      <TooltipTrigger asChild>
        <button
          className="flex cursor-pointer items-center gap-1 transition-opacity opacity-50 hover:opacity-100"
          type="button"
          aria-label="Total views"
        >
          <Icons.Eye className={iconVariants({ size: "sm" })} />
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
  );
};
