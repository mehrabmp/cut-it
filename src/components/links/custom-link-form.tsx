import { zodResolver } from "@hookform/resolvers/zod";
import { createShortLink, editShortLink } from "~/server/actions/link";
import { type ShortLink } from "~/server/db/schema";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { slugRegex } from "~/lib/utils";
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
  slug: z.string().refine((value) => slugRegex.test(value), {
    message:
      "Slugs can only contain letters, numbers, hyphens, and underscores.",
  }),
  description: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

type CustomLinkFormProps = (
  | {
      isEditing: boolean;
      defaultValues?: ShortLink;
    }
  | {
      isEditing?: undefined;
      defaultValues?: undefined;
    }
) & {
  onSetIsDialogOpen: (value: boolean) => void;
};

export const CustomLinkForm = ({
  onSetIsDialogOpen,
  isEditing = false,
  defaultValues,
}: CustomLinkFormProps) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: defaultValues?.url ?? "",
      slug: defaultValues?.slug ?? "",
      description: defaultValues?.description ?? "",
    },
  });

  const handleSuccess = () => {
    toast.success(
      isEditing ? "Link edited successfully" : "Link created successfully",
    );
    onSetIsDialogOpen(false);
    form.reset();
  };

  const { execute: createLink, status: createLinkStatus } = useAction(
    createShortLink,
    {
      onSuccess: handleSuccess,
      onError: (error) => {
        toast.error(error.serverError ?? error.fetchError);
      },
    },
  );
  const { execute: editLink, status: editLinkStatus } = useAction(
    editShortLink,
    {
      onSuccess: handleSuccess,
      onError: (error) => {
        toast.error(error.serverError ?? error.fetchError);
      },
    },
  );

  const onSubmit = (values: FormSchema) => {
    if (isEditing) {
      editLink({ slug: defaultValues?.slug ?? "", newLink: values });
    } else {
      createLink(values);
    }
  };

  const isExecuting =
    createLinkStatus === "executing" || editLinkStatus === "executing";

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
        <Button
          type="submit"
          disabled={!form.formState.isDirty}
          isLoading={isExecuting}
        >
          {isEditing
            ? isExecuting
              ? "Saving changes..."
              : "Save changes"
            : isExecuting
              ? "Creating link..."
              : "Create link"}
        </Button>
      </form>
    </Form>
  );
};
