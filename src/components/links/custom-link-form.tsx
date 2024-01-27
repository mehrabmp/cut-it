import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  checkSlug,
  createShortLink,
  editShortLink,
} from "~/server/actions/link";
import { type ShortLink } from "~/server/db/schema";
import { type SafeActionError } from "~/types";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import { nanoid, setFormErrors } from "~/lib/utils";
import { insertLinkSchema } from "~/lib/validations/link";
import { useDebounce } from "~/hooks/use-debounce";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Icons, iconVariants } from "~/components/ui/icons";
import { Input } from "~/components/ui/input";
import { Loader } from "~/components/ui/loader";
import { Textarea } from "~/components/ui/textarea";

const formSchema = insertLinkSchema;

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
  const [slug, setSlug] = useState("");
  const [isSlugExist, setIsSlugExist] = useState(false);
  const debouncedSlug = useDebounce(slug, 500);

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

  const handleError = (error: SafeActionError) => {
    if (error.validationErrors) {
      return setFormErrors(form, error.validationErrors);
    }
    toast.error(error.serverError ?? error.fetchError);
  };

  const { execute: createLink, status: createLinkStatus } = useAction(
    createShortLink,
    { onSuccess: handleSuccess, onError: handleError },
  );

  const { execute: editLink, status: editLinkStatus } = useAction(
    editShortLink,
    { onSuccess: handleSuccess, onError: handleError },
  );

  const { execute: checkSlugExists, status: checkSlugExistsStatus } = useAction(
    checkSlug,
    {
      onError: handleError,
      onSuccess: (slugExist) => {
        if (slugExist) {
          setIsSlugExist(true);
          form.setError("slug", { message: "Slug already exist" });
        } else {
          setIsSlugExist(false);
          form.clearErrors("slug");
        }
      },
    },
  );

  useEffect(() => {
    setIsSlugExist(false);

    if (!debouncedSlug) {
      return form.clearErrors("slug");
    }

    checkSlugExists({ slug: debouncedSlug });
  }, [debouncedSlug]);

  const onSubmit = (values: FormSchema) => {
    if (isSlugExist) {
      return form.setError("slug", { message: "Slug already exist" });
    }

    if (isEditing) {
      editLink({ slug: defaultValues?.slug ?? "", newLink: values });
    } else {
      createLink(values);
    }
  };

  const isExecuting =
    createLinkStatus === "executing" || editLinkStatus === "executing";
  const isCheckingSlug = checkSlugExistsStatus === "executing";

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
              <FormLabel className="flex w-full items-center justify-between">
                <div>Short Link (optional)</div>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center text-xs py-0 px-0 hover:bg-background h-auto"
                  onClick={() => {
                    const newSlug = nanoid();
                    form.setValue("slug", newSlug);
                    setSlug(newSlug);
                  }}
                >
                  <Icons.Shuffle
                    className={iconVariants({
                      size: "xs",
                      className: "mr-1",
                    })}
                  />
                  Randomize
                </Button>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="github"
                    className="pe-8"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setSlug(e.target.value);
                    }}
                  />
                  {isCheckingSlug && (
                    <div className="absolute end-3 top-1/2 -translate-y-1/2 transform text-muted-foreground">
                      <Loader />
                    </div>
                  )}
                </div>
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
