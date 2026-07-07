import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { SITE_CONFIG, NAV_LINKS } from "@/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white" role="contentinfo">
      <div className="container-custom section-padding pb-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo href="/" height={64} className="mb-4" />
            <p className="mb-2 text-sm font-medium tracking-wide text-white/90">
              {SITE_CONFIG.tagline}
            </p>
            <p className="mb-6 text-sm text-white/60 leading-relaxed">
              {SITE_CONFIG.description}
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: SITE_CONFIG.social.facebook, label: "Facebook" },
                { icon: Instagram, href: SITE_CONFIG.social.instagram, label: "Instagram" },
                { icon: Twitter, href: SITE_CONFIG.social.twitter, label: "Twitter" },
                { icon: Youtube, href: SITE_CONFIG.social.youtube, label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/70 transition-colors hover:border-white hover:bg-white hover:text-black"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-sm text-white/60 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="text-sm text-white/60 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                  className="flex items-start gap-3 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="flex items-start gap-3 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {SITE_CONFIG.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/40">
          <p>&copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
