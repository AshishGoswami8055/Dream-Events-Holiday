import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SiteShell } from "@/components/layout/site-shell";
import { Toaster } from "@/components/ui/toaster";
import { generateSEO, generateTravelAgencyJsonLd } from "@/lib/seo";
import { SITE_CONFIG } from "@/constants";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = generateSEO({
  title: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = generateTravelAgencyJsonLd();

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <Providers>
          <SiteShell>{children}</SiteShell>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
