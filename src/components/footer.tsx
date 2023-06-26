import { GitHubLogoIcon } from "@radix-ui/react-icons";

export const Footer = () => {
  return (
    <footer className="flex items-center justify-center p-6">
      <a
        href="https://github.com/mehrabmp/cut-it"
        target="_blank"
        className="text-white/50 transition-colors hover:text-neutral-200"
      >
        <GitHubLogoIcon className="h-5 w-5" />
      </a>
    </footer>
  );
};
