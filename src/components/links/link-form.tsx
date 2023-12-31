"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGuestShortLink } from "~/server/actions/link";
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

type LinkFormProps = {
  renderCustomLink: React.ReactNode;
};

export const LinkForm = ({ renderCustomLink }: LinkFormProps) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const { execute, status } = useAction(createGuestShortLink, {
    onSuccess() {
      toast.success("Link created successfully");
      form.reset();
    },
    onError(error) {
      console.log(error);
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

  const onSubmit = (values: FormSchema) => {
    execute({ url: values.url });
  };

  return (
    <Form {...form}>
      <div className="flex gap-2 w-full">
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
          <Button
            type="submit"
            size="icon"
            isLoading={status === "executing"}
            aria-label="Generate short link"
          >
            <Icons.Scissors className={iconVariants({ size: "lg" })} />
          </Button>
        </form>
        {renderCustomLink}
      </div>
    </Form>
  );
};
