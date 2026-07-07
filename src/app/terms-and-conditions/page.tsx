import { generateSEO } from "@/lib/seo";
import { SITE_CONFIG } from "@/constants";

export const metadata = generateSEO({
  title: "Terms & Conditions",
  description: "Terms and Conditions for using Dream Events & Holiday travel services and website.",
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return (
    <div className="container-custom section-padding pt-32 max-w-3xl">
      <h1 className="mb-8 text-4xl font-bold">Terms & Conditions</h1>
      <div className="prose prose-gray max-w-none space-y-6 text-muted-foreground leading-relaxed">
        <p>Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing and using the {SITE_CONFIG.name} website and services, you agree to be bound
            by these Terms and Conditions. If you do not agree, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">2. Booking & Payment</h2>
          <p>
            All bookings are subject to availability and confirmation. A deposit may be required to
            secure your booking. Full payment terms will be communicated at the time of booking.
            Prices are subject to change until booking is confirmed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">3. Cancellation Policy</h2>
          <p>
            Cancellation terms vary by package and service provider. Standard cancellation charges
            apply as follows: 30+ days before departure — 25% of total cost; 15-29 days — 50%;
            7-14 days — 75%; less than 7 days — 100%. Travel insurance is strongly recommended.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">4. Travel Documents</h2>
          <p>
            Clients are responsible for ensuring valid passports, visas, and other required travel
            documents. {SITE_CONFIG.name} can assist with visa applications but is not liable for
            denied entry due to documentation issues.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">5. Liability</h2>
          <p>
            {SITE_CONFIG.name} acts as an agent for hotels, airlines, and other service providers.
            We are not liable for acts, errors, omissions, or defaults of these suppliers. We recommend
            comprehensive travel insurance for all trips.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">6. Force Majeure</h2>
          <p>
            We are not liable for failure to perform obligations due to circumstances beyond our
            reasonable control, including natural disasters, pandemics, political unrest, or government
            restrictions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">7. Governing Law</h2>
          <p>
            These terms are governed by the laws of India. Any disputes shall be subject to the
            exclusive jurisdiction of courts in Mumbai, Maharashtra.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">8. Contact</h2>
          <p>
            For questions about these terms, contact us at {SITE_CONFIG.email}.
          </p>
        </section>
      </div>
    </div>
  );
}
