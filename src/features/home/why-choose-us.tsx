import { Compass, Headphones, BadgeCheck, Users } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { WHY_CHOOSE_US } from "@/constants";

const iconMap = {
  Compass,
  Headphones,
  BadgeCheck,
  Users,
};

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-secondary" aria-labelledby="why-us-heading">
      <div className="container-custom">
        <FadeIn>
          <SectionHeading
            subtitle="Why Us"
            title="Why Choose Dream Events & Holiday"
            description="We go beyond booking trips — we craft journeys that transform the way you see the world."
          />
        </FadeIn>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE_US.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            return (
              <StaggerItem key={item.title}>
                <div className="rounded-2xl bg-background p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
