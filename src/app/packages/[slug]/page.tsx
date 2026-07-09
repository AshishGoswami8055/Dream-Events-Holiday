import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Check, X, ArrowLeft } from "lucide-react";
import { getPackageBySlug, getRelatedPackages } from "@/actions/package.actions";
import { generateSEO, generateTourJsonLd, generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo";
import { formatPrice, truncate } from "@/lib/utils";
import { ImageGallery } from "@/components/shared/image-gallery";
import { InquiryForm } from "@/components/shared/inquiry-form";
import { PackageCard } from "@/components/shared/package-card";
import { StickyBookButton } from "@/components/shared/whatsapp-button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FadeIn } from "@/components/shared/motion";
import type { PackageDocument } from "@/types";

interface PackageDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PackageDetailPageProps) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return {};

  const packageData = pkg as unknown as PackageDocument;
  return generateSEO({
    title: packageData.title,
    description: truncate(packageData.description, 160),
    path: `/packages/${slug}`,
    image: packageData.coverImage?.url,
    type: "article",
  });
}

export default async function PackageDetailPage({ params }: PackageDetailPageProps) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);

  if (!pkg) notFound();

  const packageData = pkg as unknown as PackageDocument;
  const destinationId = typeof packageData.destination === "object"
    ? packageData.destination._id
    : packageData.destination;

  const related = await getRelatedPackages(slug, destinationId);
  const relatedPackages = related as unknown as PackageDocument[];

  const allImages = [packageData.coverImage, ...packageData.images].filter(Boolean);
  const destinationName = typeof packageData.destination === "object"
    ? packageData.destination.name
    : "";

  const tourJsonLd = generateTourJsonLd({
    title: packageData.title,
    description: packageData.description,
    slug: packageData.slug,
    price: packageData.price,
    duration: packageData.duration,
    location: packageData.location,
    image: packageData.coverImage?.url,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Packages", url: "/packages" },
    { name: packageData.title, url: `/packages/${slug}` },
  ]);

  const faqJsonLd = packageData.faqs?.length > 0
    ? generateFAQJsonLd(packageData.faqs)
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tourJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <article className="pb-24 md:pb-0">
        {/* Banner */}
        <div className="relative flex min-h-[50vh] items-end overflow-hidden">
          <Image
            src={packageData.coverImage.url}
            alt={packageData.title}
            fill
            priority
            className="object-cover scale-105 brightness-[0.85]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          <div className="container-custom relative z-10 w-full pb-12 pt-28">
            <Link href="/packages" className="mb-4 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Packages
            </Link>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="accent">{packageData.category}</Badge>
              {packageData.featured && <Badge>Featured</Badge>}
            </div>
            <h1 className="text-3xl font-bold text-white md:text-5xl">{packageData.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-white/90">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {packageData.location}{destinationName && `, ${destinationName}`}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {packageData.duration} Days
              </span>
            </div>
          </div>
        </div>

        <div className="container-custom py-10">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-10">
              <FadeIn>
                <ImageGallery images={allImages} title={packageData.title} />
              </FadeIn>

              <FadeIn>
                <section>
                  <h2 className="mb-4 text-2xl font-bold">Overview</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {packageData.description}
                  </p>
                </section>
              </FadeIn>

              {packageData.highlights?.length > 0 && (
                <FadeIn>
                  <section>
                    <h2 className="mb-4 text-2xl font-bold">Highlights</h2>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {packageData.highlights.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </FadeIn>
              )}

              <FadeIn>
                <div className="grid gap-6 sm:grid-cols-2">
                  {packageData.includes?.length > 0 && (
                    <section>
                      <h2 className="mb-4 text-xl font-bold">Includes</h2>
                      <ul className="space-y-2">
                        {packageData.includes.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {packageData.excludes?.length > 0 && (
                    <section>
                      <h2 className="mb-4 text-xl font-bold">Excludes</h2>
                      <ul className="space-y-2">
                        {packageData.excludes.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              </FadeIn>

              {packageData.itinerary?.length > 0 && (
                <FadeIn>
                  <section>
                    <h2 className="mb-6 text-2xl font-bold">Day Wise Itinerary</h2>
                    <div className="space-y-4">
                      {packageData.itinerary.map((day) => (
                        <div key={day.day} className="flex gap-4 rounded-xl border p-5">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                            {day.day}
                          </div>
                          <div>
                            <h3 className="font-semibold">{day.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{day.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </FadeIn>
              )}

              {packageData.faqs?.length > 0 && (
                <FadeIn>
                  <section>
                    <h2 className="mb-4 text-2xl font-bold">FAQs</h2>
                    <Accordion type="single" collapsible>
                      {packageData.faqs.map((faq, i) => (
                        <AccordionItem key={i} value={`faq-${i}`}>
                          <AccordionTrigger>{faq.question}</AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </section>
                </FadeIn>
              )}

              {packageData.mapEmbedUrl && (
                <FadeIn>
                  <section>
                    <h2 className="mb-4 text-2xl font-bold">Location</h2>
                    <div className="aspect-video overflow-hidden rounded-xl">
                      <iframe
                        src={packageData.mapEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Map of ${packageData.location}`}
                      />
                    </div>
                    {packageData.mapEmbedUrl.includes("openstreetmap.org") && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        ©{" "}
                        <a
                          href="https://www.openstreetmap.org/copyright"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-foreground"
                        >
                          OpenStreetMap
                        </a>{" "}
                        contributors
                      </p>
                    )}
                  </section>
                </FadeIn>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold text-primary">
                      {formatPrice(packageData.price)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">per person · {packageData.duration} days</p>
                  </CardHeader>
                  <CardContent>
                    <Separator className="mb-4" />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium">{packageData.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">{packageData.duration} Days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium">{packageData.category}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card id="inquiry">
                  <CardHeader>
                    <CardTitle>Send Inquiry</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <InquiryForm packageId={packageData._id} packageTitle={packageData.title} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {relatedPackages.length > 0 && (
            <section className="mt-16">
              <h2 className="mb-8 text-2xl font-bold">Related Packages</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedPackages.map((relatedPkg) => (
                  <PackageCard key={relatedPkg._id} pkg={relatedPkg} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      <StickyBookButton
        packageTitle={packageData.title}
        price={packageData.price}
        slug={packageData.slug}
      />
    </>
  );
}

export const revalidate = 3600;
