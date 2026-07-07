import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { TRAVEL_IMAGES } from "@/constants/images";
import { PageBanner } from "@/components/shared/page-banner";
import { TestimonialsSection } from "@/features/home/testimonials-section";
import { FadeIn } from "@/components/shared/motion";
import { Button } from "@/components/ui/button";

export const metadata = generateSEO({
  title: "Testimonials",
  description: "Read what our travelers say about their experiences with Dream Events & Holiday.",
  path: "/testimonials",
});

export default function TestimonialsPage() {
  return (
    <>
      <PageBanner
        title="Traveler Stories"
        subtitle="Testimonials"
        description="Real experiences from travelers who explored the world with us."
        imageUrl={TRAVEL_IMAGES.testimonialsBanner.url}
        imageAlt="Happy travelers on a group trip"
        height="sm"
      />
      <TestimonialsSection showHeading={false} />
      <div className="container-custom pb-20 text-center">
        <FadeIn>
          <p className="mb-4 text-muted-foreground">Ready to create your own story?</p>
          <Button asChild variant="accent" size="lg" className="rounded-full btn-glow">
            <Link href="/packages">Start Planning</Link>
          </Button>
        </FadeIn>
      </div>
    </>
  );
}
