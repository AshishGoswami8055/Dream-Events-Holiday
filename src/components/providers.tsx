"use client";

import { SessionProvider } from "next-auth/react";
import { SiteConfigProvider } from "@/components/providers/site-config-provider";
import type { PublicSiteConfig } from "@/lib/site-settings";

export function Providers({
  children,
  siteConfig,
}: {
  children: React.ReactNode;
  siteConfig: PublicSiteConfig;
}) {
  return (
    <SessionProvider>
      <SiteConfigProvider config={siteConfig}>{children}</SiteConfigProvider>
    </SessionProvider>
  );
}
