"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  createNewLink,
  generateShortLink,
  getOrCreateLinkById,
  setLinkIdCookie,
} from "~/server/api/link";

import { action } from "~/lib/safe-action";
import { insertPublicLinkSchema } from "~/lib/validations/link";

export const createGuestShortLink = action(
  insertPublicLinkSchema,
  async ({ url }) => {
    const cookieStore = cookies();
    const existingLinkId = cookieStore.get("link-id");

    if (!existingLinkId) {
      const newLink = await createNewLink();
      if (!newLink) {
        return { message: "Error in creating new link" };
      }

      setLinkIdCookie(newLink.id);

      await generateShortLink({
        url,
        linkId: newLink.id,
        isGuestUser: true,
        slug: "",
      });
    } else {
      const link = await getOrCreateLinkById(existingLinkId.value);

      setLinkIdCookie(link.id);

      await generateShortLink({
        url,
        linkId: link.id,
        isGuestUser: true,
        slug: "",
      });
    }

    revalidatePath("/");

    return { message: "Link creation successful" };
  },
);
