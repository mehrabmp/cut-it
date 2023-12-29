import { getServerAuthSession } from "~/server/auth";

import { Button } from "~/components/ui/button";

import { SigninDialog } from "./signin-dialog";
import { UserProfileDropdown } from "./user-profile-dropdown";

export const UserProfile = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    return (
      <SigninDialog>
        <Button size="sm">Sign In</Button>
      </SigninDialog>
    );
  }

  return <UserProfileDropdown user={session.user} />;
};
