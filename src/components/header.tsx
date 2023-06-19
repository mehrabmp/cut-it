import { Paytone_One } from "next/font/google";
import { Button } from "@/components/ui/button";

const paytoneOne = Paytone_One({ subsets: ["latin"], weight: ["400"] });

export const Header = () => {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between p-4">
      <h1 className={`${paytoneOne.className} text-3xl`}>Cut it</h1>
      <Button variant="ghost">Login</Button>
    </header>
  );
};
