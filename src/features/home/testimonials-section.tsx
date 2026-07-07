"use client";

import { Star, Quote } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { TESTIMONIALS } from "@/constants/testimonials";

interface TestimonialsSectionProps {
  limit?: number;
  showHeading?: boolean;
}

export function TestimonialsSection({ limit, showHeading = true }: TestimonialsSectionProps) {
  const testimonials = limit ? TESTIMONIALS.slice(0, limit) : TESTIMONIALS;

  return (
    <section className="section-padding" aria-labelledby="testimonials-heading">
      <div className="container-custom">
        {showHeading && (
          <FadeIn>
            <SectionHeading
              subtitle="Testimonials"
              title="What Our Travelers Say"
              description="Real stories from real travelers who experienced the magic of Dream Events & Holiday."
            />
          </FadeIn>
        )}

        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.id}>
              <div className="relative h-full rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/10" aria-hidden="true" />
                <div className="mb-4 flex gap-0.5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-black text-black" aria-hidden="true" />
                  ))}
                </div>
                <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  {testimonial.package && (
                    <p className="mt-1 text-xs text-primary">{testimonial.package}</p>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
