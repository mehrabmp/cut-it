import type { Link } from "@/server/db/schema";
import {
  Card,
  CardContent,
  // CardFooter,
  // CardHeader,
  // CardTitle,
} from "@/components/ui/card";

export const LinkCard = ({ slug, url }: Link) => {
  return (
    <Card className="w-full">
      <CardContent>
        <h3 className="text-sm">
          <a
            href={`https://cutit.vercel.app/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            cutit.vercel.app/{slug}
          </a>
        </h3>
        <h4 className="text-xs text-neutral-500">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-clip"
          >
            {url}
          </a>
        </h4>
      </CardContent>
    </Card>
  );
};
