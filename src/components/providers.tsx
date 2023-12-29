"use client";

import { TooltipProvider } from "~/components/ui/tooltip";
import { ThemeProvider } from "~/components/theme-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
};
