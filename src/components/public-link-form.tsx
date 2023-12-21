"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hook";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Loader } from "~/components/ui/loader";
import type { createShortLink } from "~/app/actions";

interface Props {
  createShortLink: typeof createShortLink;
}

const formSchema = z.object({
  url: z.string().url(),
});

type FormSchema = z.infer<typeof formSchema>;

export const PublicLinkForm = ({ createShortLink }: Props) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const { execute, isExecuting } = useAction(createShortLink, {
    onSuccess() {
      toast.success("Link created successfully");
      form.reset();
    },
    onError(error) {
      const errorMessage = error.serverError
        ? "Internal Server Error"
        : error.validationError
          ? "Bad Request"
          : error.fetchError
            ? "Fetch Error"
            : "Error";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (values: FormSchema) =>
    execute({ url: values.url, slug: "" });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full justify-center gap-2"
      >
        <div className="flex-1">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter the link here"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" variant="outline" disabled={isExecuting}>
          {isExecuting && <Loader size="sm" className="mr-2" />}
          Cut it
        </Button>
      </form>
    </Form>
  );
};
