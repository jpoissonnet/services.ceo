import Link from "next/link";

import { AuthControls } from "@/components/auth-controls";
import InputPrompt from "@/components/input-prompt";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { siteConfig } from "@/lib/site-config";
export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon-16x16.png",
    apple: "/favicon/apple-touch-icon.png",
  },
  verification: {
    google: siteConfig.googleSiteVerificationId,
  },
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: "/opengraph-image.jpg",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: "/opengraph-image.jpg",
  },
};
const HomePage = async () => {
  const session = await auth();

  return (
    <>
      <header className="w-full border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="font-mono text-lg font-bold">
            next-starter
          </Link>
          <div className="flex items-center gap-2">
            <AuthControls session={session} />
          </div>
        </div>
      </header>
      <main className="bg-background flex min-h-screen items-center justify-center">
        <div className="flex w-full max-w-md flex-col items-center gap-6">
          <h1 className="text-center text-2xl font-bold">
            What do you need help with?
          </h1>
          <InputPrompt />
        </div>
      </main>
      <footer className="text-muted-foreground absolute bottom-3 w-full text-center text-sm">
        © {new Date().getFullYear()} By{" "}
        <Link
          href="https://michalskolak.pl"
          className={buttonVariants({ variant: "link", className: "!p-0" })}
        >
          Michał Skolak
        </Link>
      </footer>
    </>
  );
};

export default HomePage;
