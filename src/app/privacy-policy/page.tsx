import { generateSEO } from "@/lib/seo";
import { SITE_CONFIG } from "@/constants";

export const metadata = generateSEO({
  title: "Privacy Policy",
  description: "Privacy Policy for Dream Events & Holiday. Learn how we collect, use, and protect your personal information.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="container-custom section-padding pt-32 max-w-3xl">
      <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>
      <div className="prose prose-gray max-w-none space-y-6 text-muted-foreground leading-relaxed">
        <p>Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
          <p>
            {SITE_CONFIG.name} collects information you provide directly, including name, email address,
            phone number, travel preferences, and payment information when you book our services or
            submit inquiries through our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
          <p>We use collected information to:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Process and manage your travel bookings and inquiries</li>
            <li>Communicate with you about your trips and our services</li>
            <li>Send promotional materials (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">3. Information Sharing</h2>
          <p>
            We do not sell your personal information. We may share information with trusted travel
            partners, hotels, and service providers necessary to fulfill your bookings, and when
            required by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal
            information against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">5. Cookies</h2>
          <p>
            Our website uses cookies to enhance your browsing experience, analyze site traffic, and
            personalize content. You can control cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">6. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information. Contact us
            at {SITE_CONFIG.email} to exercise these rights.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">7. Contact Us</h2>
          <p>
            For privacy-related questions, contact us at {SITE_CONFIG.email} or {SITE_CONFIG.phone}.
          </p>
        </section>
      </div>
    </div>
  );
}
