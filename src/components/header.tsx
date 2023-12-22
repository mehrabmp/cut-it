import { Paytone_One } from "next/font/google";

import { Button } from "~/components/ui/button";

import { ThemeToggle } from "./theme-toggle";

const paytoneOne = Paytone_One({ subsets: ["latin"], weight: ["400"] });

export const Header = () => {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between p-4">
      <h1 className={`${paytoneOne.className} text-3xl`}>Cut it</h1>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button>Sign in</Button>
      </div>
    </header>
  );
};
