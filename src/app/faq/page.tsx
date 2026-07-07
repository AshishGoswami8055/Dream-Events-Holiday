import Link from "next/link";
import { generateSEO, generateFAQJsonLd } from "@/lib/seo";
import { TRAVEL_IMAGES } from "@/constants/images";
import { PageBanner } from "@/components/shared/page-banner";
import { FAQSection } from "@/features/home/faq-section";
import { FadeIn } from "@/components/shared/motion";
import { Button } from "@/components/ui/button";
import { FAQ_ITEMS } from "@/constants";

export const metadata = generateSEO({
  title: "FAQ",
  description: "Frequently asked questions about booking travel packages.",
  path: "/faq",
});

export default function FAQPage() {
  const faqJsonLd = generateFAQJsonLd([...FAQ_ITEMS]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PageBanner
        title="Frequently Asked Questions"
        subtitle="Help Center"
        description="Find answers to common questions about our services, booking process, and travel policies."
        imageUrl={TRAVEL_IMAGES.faqBanner.url}
        imageAlt="Travel planning and world map"
        height="sm"
      />
      <FAQSection showHeading={false} />
      <div className="container-custom pb-20 text-center">
        <FadeIn>
          <p className="mb-4 text-muted-foreground">Still have questions?</p>
          <Button asChild variant="accent" className="rounded-full btn-glow">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </FadeIn>
      </div>
    </>
  );
}
