"use client";

import Image from "next/image";
import Link from "next/link";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

type AuthControlsProps = {
  session: Session | null;
};

export const AuthControls = ({ session }: AuthControlsProps) => {
  if (!session)
    return (
      <Button
        className="cursor-pointer"
        onClick={async () => await signIn("github")}
      >
        Sign in
      </Button>
    );

  const { user } = session;

  return (
    <>
      <Link href="/profile">
        <Image
          className="cursor-pointer overflow-hidden rounded-full transition hover:opacity-80"
          src={`${user?.image}`}
          alt={`${user?.name}`}
          width={32}
          height={32}
        />
      </Link>
      <Button className="cursor-pointer" onClick={async () => await signOut()}>
        Sign out
      </Button>
    </>
  );
};
