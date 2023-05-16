import { Github } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="flex items-center justify-center bg-neutral-200 p-2 text-neutral-800">
      <a href="https://github.com/mehrabmp/cut-it" target="_blank">
        <Github size={22} />
      </a>
    </footer>
  );
};
