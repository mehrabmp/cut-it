import { zodResolver } from "@hookform/resolvers/zod";
import { createShortLink } from "~/server/actions/link";
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
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

const formSchema = z.object({
  url: z.string().url(),
  slug: z.string(),
  description: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

type CustomLinkFormProps = {
  onSetIsDialogOpen: (value: boolean) => void;
};

export const CustomLinkForm = ({ onSetIsDialogOpen }: CustomLinkFormProps) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      slug: "",
      description: "",
    },
  });

  const { execute: createLink, status: createLinkStatus } = useAction(
    createShortLink,
    {
      onSuccess() {
        toast.success("Link created successfully");
        onSetIsDialogOpen(false);
        form.reset();
      },
      onError(error) {
        toast.error(error.serverError);
      },
    },
  );

  const onSubmit = (values: FormSchema) => {
    createLink({
      url: values.url,
      slug: values.slug,
      description: values.description,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-4"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://github.com/mehrabmp/cut-it"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Link (optional)</FormLabel>
              <FormControl>
                <Input placeholder="github" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Cut It is a free open source tool to generate short links"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" isLoading={createLinkStatus === "executing"}>
          {createLinkStatus === "executing"
            ? "Creating link..."
            : "Create link"}
        </Button>
      </form>
    </Form>
  );
};
