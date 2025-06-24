"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { PropsWithChildren } from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/theme-switcher";

const queryClient = new QueryClient();

const RootComponent = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class">
        {children}
        <ThemeSwitcher className="absolute right-5 bottom-5 z-10" />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default RootComponent;
