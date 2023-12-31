import { getServerAuthSession } from "~/server/auth";

import { CustomLinkButton } from "~/components/links/custom-link-button";
import { CustomLinkDialog } from "~/components/links/custom-link-dialog";

export const CustomLink = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    return <CustomLinkButton disabled />;
  }

  return <CustomLinkDialog />;
};
