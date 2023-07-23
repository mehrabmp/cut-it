import { LinkList } from "@/components/link-list";
import { PublicLinkForm } from "@/components/public-link-form";
import { Loader } from "@/components/ui/loader";
import { Suspense } from "react";
import { createShortLink } from "./actions";

export const runtime = "edge";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="my-20 space-y-2 text-center">
        <h1 className="text-4xl font-bold">Free URL Shortener</h1>
        <h2 className="font-normal text-neutral-400">
          Cut It is a free open source tool to shorten URLs and generate short
          links
        </h2>
      </div>
      <div className="flex w-full max-w-sm flex-col items-center space-y-6">
        <PublicLinkForm createShortLink={createShortLink} />
        <Suspense fallback={<Loader />}>
          <LinkList />
        </Suspense>
      </div>
    </div>
  );
}
