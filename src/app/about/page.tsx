import Link from "next/link";
import Image from "next/image";
import { Award, Globe, Heart, Shield } from "lucide-react";
import { ABOUT_BANNER_URL, ABOUT_TEAM_URL } from "@/constants/images";
import { generateSEO } from "@/lib/seo";
import { PageBanner } from "@/components/shared/page-banner";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { TRAVEL_STATS } from "@/constants";
import { Button } from "@/components/ui/button";

export const metadata = generateSEO({
  title: "About Us",
  description: "Learn about Dream Events & Holiday — your trusted luxury travel partner with 15+ years of crafting unforgettable journeys.",
  path: "/about",
});

const values = [
  { icon: Heart, title: "Passion for Travel", description: "We live and breathe travel, bringing authentic experiences to every journey we craft." },
  { icon: Shield, title: "Trust & Safety", description: "Your safety and satisfaction are our top priorities on every trip we organize." },
  { icon: Globe, title: "Global Expertise", description: "Deep local knowledge across 150+ destinations worldwide ensures authentic experiences." },
  { icon: Award, title: "Excellence", description: "Award-winning service recognized by travelers and industry partners alike." },
];

export default function AboutPage() {
  return (
    <>
      <PageBanner
        title="About Us"
        subtitle="Our Story"
        description="Crafting extraordinary travel experiences since 2010 — where every journey becomes a story worth telling."
        imageUrl={ABOUT_BANNER_URL}
        imageAlt="Luxury travel experiences worldwide"
      />

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <FadeIn>
              <SectionHeading subtitle="Who We Are" title="Your Journey, Our Passion" align="left" />
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Dream Events & Holiday was founded with a simple belief: travel should transform you.
                  What started as a small team of passionate explorers has grown into one of India&apos;s
                  most trusted luxury travel agencies.
                </p>
                <p>
                  For over 15 years, we&apos;ve been crafting bespoke journeys that go beyond sightseeing.
                  From romantic honeymoons in the Maldives to adventurous expeditions in Ladakh, every
                  trip is designed with meticulous attention to detail.
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
                  alt="Dream Events & Holiday travel experts"
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
            <SectionHeading subtitle="Our Values" title="What Drives Us" />
          </FadeIn>
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <div className="card-premium h-full p-8 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                    <value.icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 font-semibold">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="section-padding bg-[#0a1628] text-white">
        <div className="container-custom">
          <FadeIn>
            <SectionHeading subtitle="By The Numbers" title="Our Impact" />
            <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
              {TRAVEL_STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-4xl font-bold text-accent md:text-5xl">{stat.value}</p>
                  <p className="mt-2 text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
