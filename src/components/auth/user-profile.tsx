import { getServerAuthSession } from "~/server/auth";
import { type User } from "next-auth";

import { Button } from "~/components/ui/button";

import { SigninDialog } from "./signin-dialog";
import { UserProfileDropdown } from "./user-profile-dropdown";

export const UserProfile = async () => {
  const session = await getServerAuthSession();
  const user = session?.user;

  if (!user) {
    <SigninDialog>
      <Button size="sm">Sign In</Button>
    </SigninDialog>;
  }

  return <UserProfileDropdown user={user as User} />;
};
