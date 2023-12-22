import { compactNumberFormatter, standardNumberFormatter } from "~/lib/utils";
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
            {compactNumberFormatter.format(viewCount)}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-sans">
          {standardNumberFormatter.format(viewCount)} Total views
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
