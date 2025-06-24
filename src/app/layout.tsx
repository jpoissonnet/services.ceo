import "@/styles/globals.css";

import { PropsWithChildren } from "react";

import RootComponent from "@/app/root-component";
import { fonts } from "@/lib/fonts";
import { cn } from "@/lib/utils";

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen font-sans", fonts)}>
        <RootComponent>{children}</RootComponent>
      </body>
    </html>
  );
};

export default RootLayout;
