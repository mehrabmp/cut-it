import { Paytone_One } from "next/font/google";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { Icons, iconVariants } from "~/components/ui/icons";

import { ThemeToggle } from "./theme-toggle";

const paytoneOne = Paytone_One({ subsets: ["latin"], weight: ["400"] });

export const Header = () => {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between p-4">
      <h1 className={`${paytoneOne.className} text-3xl`}>Cut it</h1>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground transition-colors hover:text-foreground"
          asChild
        >
          <Link href="https://github.com/mehrabmp/cut-it" target="_blank">
            <Icons.github className={iconVariants({ size: "lg" })} />
            <span className="sr-only">github repository</span>
          </Link>
        </Button>
        <ThemeToggle />
        <Button size="sm">Sign In</Button>
      </div>
    </header>
  );
};
