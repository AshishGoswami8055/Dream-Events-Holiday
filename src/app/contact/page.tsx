import { generateSEO } from "@/lib/seo";
import { TRAVEL_IMAGES } from "@/constants/images";
import { PageBanner } from "@/components/shared/page-banner";
import { ContactForm, ContactInfo } from "@/features/contact/contact-form";
import { FadeIn } from "@/components/shared/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = generateSEO({
  title: "Contact Us",
  description: "Get in touch with Dream Events & Holiday. We're here to help plan your perfect vacation.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageBanner
        title="Let's Plan Your Journey"
        subtitle="Contact Us"
        description="Have questions or ready to book? Our travel experts are here to help 24/7."
        imageUrl={TRAVEL_IMAGES.contactBanner.url}
        imageAlt="Travel planning consultation"
        height="sm"
      />

      <div className="container-custom section-padding">
        <div className="grid gap-10 lg:grid-cols-5">
          <FadeIn className="lg:col-span-3">
            <Card className="card-premium border-0">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn className="lg:col-span-2">
            <Card className="card-premium h-full border-0 bg-[#0a1628] text-white">
              <CardHeader>
                <CardTitle className="text-white">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactInfo />
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </>
  );
}
