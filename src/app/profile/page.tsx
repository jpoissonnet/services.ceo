import React from "react";

import ProfileComponent from "@/app/profile/profile-component";
import { auth } from "@/lib/auth";

const Page = async () => {
  const session = await auth();
  return <ProfileComponent session={session} />;
};

export default Page;
