"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createShortLink } from "~/server/actions/link-actions";
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
import { Icons, iconVariants } from "~/components/ui/icons";
import { Input } from "~/components/ui/input";

const formSchema = z.object({
  url: z.string().url(),
});

type FormSchema = z.infer<typeof formSchema>;

export const PublicLinkForm = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const { execute, status } = useAction(createShortLink, {
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
                  <Input placeholder="Enter the link here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" size="icon" loading={status === "executing"}>
          <Icons.Scissors className={iconVariants({ size: "lg" })} />
        </Button>
      </form>
    </Form>
  );
};
