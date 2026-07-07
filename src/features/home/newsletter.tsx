"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeNewsletter } from "@/actions/inquiry.actions";
import { useToast } from "@/hooks/use-toast";
import { FadeIn } from "@/components/shared/motion";
import { TRAVEL_IMAGES } from "@/constants/images";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", email);
      const result = await subscribeNewsletter(formData);
      if (result.success) {
        toast({ title: "Subscribed!", description: result.message });
        setEmail("");
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };

  return (
    <section className="section-padding" aria-labelledby="newsletter-heading">
      <div className="container-custom">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-[#0a1628] px-8 py-16 text-center md:px-16">
            <div className="absolute inset-0">
              <Image
                src={TRAVEL_IMAGES.packagesBanner.url}
                alt=""
                fill
                className="object-cover opacity-20"
                sizes="100vw"
              />
            </div>

            <div className="relative mx-auto max-w-xl">
              <h2 id="newsletter-heading" className="mb-3 text-3xl font-bold text-white md:text-4xl">
                Get Exclusive Travel Deals
              </h2>
              <p className="mb-8 text-white/80">
                Subscribe to our newsletter for early access to special offers, destination guides, and travel inspiration.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-9 bg-white"
                    aria-label="Email address for newsletter"
                  />
                </div>
                <Button type="submit" variant="accent" size="lg" disabled={isPending} className="shrink-0 rounded-full btn-glow">
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
