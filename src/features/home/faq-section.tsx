import { SectionHeading } from "@/components/shared/section-heading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FadeIn } from "@/components/shared/motion";
import { FAQ_ITEMS } from "@/constants";

interface FAQSectionProps {
  items?: typeof FAQ_ITEMS;
  showHeading?: boolean;
}

export function FAQSection({ items = FAQ_ITEMS, showHeading = true }: FAQSectionProps) {
  return (
    <section className="section-padding bg-secondary" aria-labelledby="faq-heading">
      <div className="container-custom max-w-3xl">
        {showHeading && (
          <FadeIn>
            <SectionHeading
              subtitle="FAQ"
              title="Frequently Asked Questions"
              description="Everything you need to know about booking and traveling with us."
            />
          </FadeIn>
        )}

        <FadeIn>
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}
