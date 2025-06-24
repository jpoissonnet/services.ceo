import "@/styles/globals.css";

import Link from "next/link";
import { PropsWithChildren } from "react";

import RootComponent from "@/app/root-component";
import { AuthControls } from "@/components/auth-controls";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { auth } from "@/lib/auth";
import { fonts } from "@/lib/fonts";
import { cn } from "@/lib/utils";

const RootLayout = async ({ children }: PropsWithChildren) => {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen font-sans", fonts)}>
        <header className="w-full border-b">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="font-mono text-lg font-bold">
              services.ceo
            </Link>
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <AuthControls session={session} />
            </div>
          </div>
        </header>
        <RootComponent>{children}</RootComponent>
      </body>
    </html>
  );
};

export default RootLayout;
