"use client";

import { createContext, useContext } from "react";
import type { PublicSiteConfig } from "@/lib/site-settings";
import { SITE_CONFIG } from "@/constants";

const SiteConfigContext = createContext<PublicSiteConfig>({
  name: SITE_CONFIG.name,
  tagline: SITE_CONFIG.tagline,
  description: SITE_CONFIG.description,
  url: SITE_CONFIG.url,
  email: SITE_CONFIG.email,
  phone: SITE_CONFIG.phone,
  address: SITE_CONFIG.address,
  whatsapp: SITE_CONFIG.whatsapp,
  social: { ...SITE_CONFIG.social },
});

export function SiteConfigProvider({
  config,
  children,
}: {
  config: PublicSiteConfig;
  children: React.ReactNode;
}) {
  return <SiteConfigContext.Provider value={config}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
