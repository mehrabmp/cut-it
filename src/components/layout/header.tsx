import { Suspense } from "react";
import { Paytone_One } from "next/font/google";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { Icons, iconVariants } from "~/components/ui/icons";
import { Loader } from "~/components/ui/loader";
import { UserProfile } from "~/components/auth/user-profile";
import { ThemeToggle } from "~/components/theme-toggle";

const paytoneOne = Paytone_One({ subsets: ["latin"], weight: ["400"] });

export const Header = () => {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between p-4">
      <Link href="/" className={`${paytoneOne.className} text-3xl`}>
        Cut it
      </Link>
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
        <Suspense fallback={<Loader size="xl" />}>
          <UserProfile />
        </Suspense>
      </div>
    </header>
  );
};
