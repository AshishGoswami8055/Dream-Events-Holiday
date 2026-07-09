import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SiteShell } from "@/components/layout/site-shell";
import { Toaster } from "@/components/ui/toaster";
import { generateSEO, generateTravelAgencyJsonLd } from "@/lib/seo";
import { getPublicSiteConfig } from "@/lib/site-settings";
import { Providers } from "@/components/providers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getPublicSiteConfig();
  return generateSEO({
    title: `${config.name} - ${config.tagline}`,
    description: config.description,
  });
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfig = await getPublicSiteConfig();
  const jsonLd = generateTravelAgencyJsonLd(siteConfig);

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <Providers siteConfig={siteConfig}>
          <SiteShell>{children}</SiteShell>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
