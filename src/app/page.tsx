import { LinkList } from "@/components/home/link-list";
import { PublicLinkForm } from "@/components/home/public-link-form";
import { Loader } from "@/components/ui/loader";
import { Suspense } from "react";

export const runtime = "edge";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-20 p-2">
      <div className="mt-20 space-y-2 text-center">
        <h1 className="text-4xl font-bold">Free URL Shortener</h1>
        <h2 className="font-normal text-neutral-400">
          Cut It is a free open source tool to shorten URLs and generate short
          links
        </h2>
      </div>
      <PublicLinkForm />
      <Suspense fallback={<Loader />}>
        <LinkList />
      </Suspense>
    </div>
  );
}
