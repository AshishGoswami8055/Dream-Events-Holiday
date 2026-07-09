import { Plane, Globe2, Sparkles, Check } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { SERVICE_CATEGORIES } from "@/constants";

const iconMap = {
  Plane,
  Globe2,
  Sparkles,
};

export function ServicesSection() {
  return (
    <section className="section-padding" aria-labelledby="services-heading">
      <div className="container-custom">
        <FadeIn>
          <SectionHeading
            subtitle="What We Offer"
            title="Our Services"
            description="Complete travel solutions under one roof — from bookings and holiday packages to premium celebrations and corporate travel."
          />
        </FadeIn>

        <StaggerContainer className="grid gap-8 lg:grid-cols-3">
          {SERVICE_CATEGORIES.map((category) => {
            const Icon = iconMap[category.icon as keyof typeof iconMap];
            return (
              <StaggerItem key={category.title}>
                <div className="flex h-full flex-col rounded-3xl border border-border bg-background p-8 shadow-sm transition-all hover:shadow-md">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{category.title}</h3>
                  <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
                    {category.description}
                  </p>
                  <ul className="mt-auto space-y-3">
                    {category.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
