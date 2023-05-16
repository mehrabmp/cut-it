import { Button } from "@/components/button";
import { Input } from "@/components/input";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-20 p-2">
      <div className="mt-20 space-y-2 text-center">
        <h1 className="text-4xl font-bold">Free URL Shortener</h1>
        <h2 className="font-normal text-neutral-800">
          Cut It is a free open source tool to shorten URLs and generate short
          links
        </h2>
      </div>
      <div className="flex w-80 items-center justify-center gap-2">
        <div className="flex-1">
          <Input placeholder="Enter the link here" />
        </div>
        <div className="">
          <Button>Cut it</Button>
        </div>
      </div>
    </div>
  );
}
