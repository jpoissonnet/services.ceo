import Link from "next/link";

import InputPrompt from "@/components/input-prompt";
import { buttonVariants } from "@/components/ui/button";
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
  return (
    <>
      <main
        className={`bg-background mt-5 flex min-h-[50svh] items-center justify-center`}
      >
        <div className="flex w-full max-w-md flex-col items-center gap-6">
          <h1 className="text-center text-2xl font-bold">
            What do you need help with?
          </h1>
          <InputPrompt />
        </div>
      </main>
      <footer className="text-muted-foreground w-full text-center text-sm">
        © {new Date().getFullYear()} By{" "}
        <Link
          href="https://michalskolak.pl"
          className={buttonVariants({ variant: "link", className: "!p-0" })}
        >
          Services.ceo
        </Link>
      </footer>
    </>
  );
};

export default HomePage;
