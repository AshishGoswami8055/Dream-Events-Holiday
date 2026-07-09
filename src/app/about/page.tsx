import Link from "next/link";
import Image from "next/image";
import { Check, Eye, Target, MapPin } from "lucide-react";
import { ABOUT_BANNER_URL, ABOUT_TEAM_URL } from "@/constants/images";
import { generateSEO } from "@/lib/seo";
import { PageBanner } from "@/components/shared/page-banner";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { ABOUT_JOURNEY, VISION_MISSION } from "@/constants";
import { Button } from "@/components/ui/button";

export const metadata = generateSEO({
  title: "About Us",
  description:
    "About Dream Event & Holidays — from a humble beginning in 2019 to a trusted travel partner across Ahmedabad, Modasa, and Surat.",
  path: "/about",
});

const branches = [
  { city: "Ahmedabad", note: "Head Office" },
  { city: "Modasa", note: "Branch" },
  { city: "Surat", note: "Branch" },
];

export default function AboutPage() {
  return (
    <>
      <PageBanner
        title="About Us"
        subtitle="About Dream Event & Holidays"
        description="From one dream… to thousands of happy journeys."
        imageUrl={ABOUT_BANNER_URL}
        imageAlt="Dream Event & Holidays — travel experiences across India and the world"
      />

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <FadeIn>
              <SectionHeading
                subtitle="Our Story"
                title="Every Great Journey Begins With a Dream"
                align="left"
              />
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Every great journey begins with a dream, and ours started in 2019 with a single
                  vision, operating from home with one passionate individual determined to create
                  meaningful travel experiences.
                </p>
                <p>
                  What began as a small dream steadily grew through dedication, honesty, and an
                  unwavering commitment to customer satisfaction. In 2021, we proudly opened our
                  first office, marking the beginning of a new chapter in our journey.
                </p>
                <p>
                  Today, Dream Event & Holidays is supported by a dedicated team of 10+ professionals
                  across Sales, Reservations, Flight Ticketing, Operations, and Customer Support,
                  working together to deliver seamless travel solutions across India and
                  international destinations.
                </p>
                <p>
                  Over the years, we have successfully managed 10+ Destination Weddings and continue
                  to serve 25+ corporate organizations every year for business travel, conferences,
                  incentive tours, and employee travel requirements.
                </p>
              </div>
              <Button asChild className="mt-8 rounded-full btn-glow" variant="accent">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </FadeIn>
            <FadeIn>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src={ABOUT_TEAM_URL}
                  alt="Dream Event & Holidays travel experts"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/60">
        <div className="container-custom">
          <FadeIn>
            <SectionHeading
              subtitle="Our Presence"
              title="Growing Across Gujarat"
              description="Our presence now extends across three locations — ready to help you plan your next journey."
            />
          </FadeIn>
          <StaggerContainer className="grid gap-6 sm:grid-cols-3">
            {branches.map((branch) => (
              <StaggerItem key={branch.city}>
                <div className="rounded-2xl bg-background p-8 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MapPin className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold">{branch.city}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{branch.note}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <FadeIn className="mx-auto mt-12 max-w-3xl text-center text-muted-foreground leading-relaxed">
            <p>
              At Dream Event & Holidays, we believe travel is about more than reaching a
              destination—it&apos;s about exploring new places, celebrating life&apos;s special
              moments, and sharing unforgettable experiences with the people who matter most.
              That&apos;s why we take the time to understand every traveler&apos;s needs, recommend
              the right destinations, design well-planned itineraries, and ensure every trip is
              smooth, comfortable, and worry-free.
            </p>
            <p className="mt-4">
              From a humble beginning in 2019 to becoming a trusted name in the travel industry, our
              growth has been built on hard work, lasting relationships, and the confidence our
              clients place in us. As we continue to grow, our commitment remains the same—to
              deliver exceptional service and make every trip truly memorable.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding bg-black text-white">
        <div className="container-custom">
          <FadeIn>
            <div className="mb-12 mx-auto max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/60">
                Milestones
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                Our Journey at a Glance
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
              {ABOUT_JOURNEY.map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-3xl font-bold text-white md:text-4xl">{item.value}</p>
                  <p className="mt-2 flex items-center justify-center gap-2 text-sm text-white/70">
                    <Check className="h-4 w-4 shrink-0 text-white/50" aria-hidden="true" />
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-14 text-center text-lg font-medium text-white/90 md:text-xl">
              From One Dream… To Thousands of Happy Journeys.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <FadeIn>
            <SectionHeading
              subtitle="Purpose"
              title="Our Vision & Mission"
              description="The principles that guide every journey we plan."
            />
          </FadeIn>
          <div className="grid gap-8 lg:grid-cols-2">
            <FadeIn>
              <div className="h-full rounded-3xl border border-border bg-secondary/40 p-8 md:p-10">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Eye className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mb-4 text-2xl font-semibold">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">{VISION_MISSION.vision}</p>
              </div>
            </FadeIn>
            <FadeIn>
              <div className="h-full rounded-3xl border border-border bg-secondary/40 p-8 md:p-10">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Target className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mb-4 text-2xl font-semibold">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">{VISION_MISSION.mission}</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
