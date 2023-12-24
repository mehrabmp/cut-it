import { Suspense } from "react";

import { Heading } from "~/components/ui/heading";
import { Loader } from "~/components/ui/loader";
import { LinkForm } from "~/components/links/link-form";
import { LinkList } from "~/components/links/link-list";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="my-10 space-y-2 text-center">
        <Heading variant="h1" isFirstBlock>
          Free URL Shortener
        </Heading>
        <Heading variant="h2" className="text-muted-foreground">
          Cut It is a free open source tool to generate short links
        </Heading>
      </div>
      <div className="flex items-center w-full max-w-md flex-col gap-4">
        <LinkForm />
        <Suspense fallback={<Loader size="4xl" className="my-20" />}>
          <LinkList />
        </Suspense>
      </div>
    </div>
  );
}
