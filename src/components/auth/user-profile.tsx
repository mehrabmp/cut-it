import { getUserById } from "~/server/api/user";
import { getServerAuthSession } from "~/server/auth";

import { Button } from "~/components/ui/button";

import { SigninDialog } from "./signin-dialog";
import { UserProfileDropdown } from "./user-profile-dropdown";

const renderSigninDialog = () => (
  <SigninDialog>
    <Button size="sm">Sign In</Button>
  </SigninDialog>
);

export const UserProfile = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    return renderSigninDialog();
  }

  const user = await getUserById(session.user.id);
  if (!user) {
    return renderSigninDialog();
  }

  return <UserProfileDropdown user={user} />;
};
