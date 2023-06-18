"use client";

import { z } from "zod";
import { useZact } from "zact/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createShortLink } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  url: z.string().url(),
});

type FormSchema = z.infer<typeof formSchema>;

export const PublicLinkForm = () => {
  const { mutate, error, isLoading } = useZact(createShortLink);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = (values: FormSchema) => {
    void mutate({ url: values.url, key: "" });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-center gap-2"
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
        <Button type="submit" disabled={isLoading}>
          Cut it
        </Button>
      </form>
    </Form>
  );
};