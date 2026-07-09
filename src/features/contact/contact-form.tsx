"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Phone, Mail, MapPin, Clock } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { submitContact } from "@/actions/inquiry.actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSiteConfig } from "@/components/providers/site-config-provider";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactInput) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, String(value)));
      const result = await submitContact(formData);
      if (result.success) {
        toast({ title: "Message Sent!", description: result.message });
        reset();
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" {...register("name")} placeholder="Your name" />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register("email")} placeholder="your@email.com" />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input id="phone" {...register("phone")} placeholder="+91 9023612162" />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          <Input id="subject" {...register("subject")} placeholder="How can we help?" />
          {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea id="message" {...register("message")} placeholder="Tell us about your travel plans..." rows={5} />
        {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
      </div>
      <Button type="submit" size="lg" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Message"}
      </Button>
    </form>
  );
}

export function ContactInfo() {
  const siteConfig = useSiteConfig();
  const linkClass = "font-medium text-white/90 hover:text-white transition-colors";
  const labelClass = "text-sm font-medium text-white/50";

  return (
    <div className="space-y-6">
      {[
        { icon: Phone, label: "Phone", value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s/g, "")}` },
        { icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
        { icon: MapPin, label: "Address", value: siteConfig.address },
        { icon: Clock, label: "Hours", value: "Mon - Sat: 9:00 AM - 7:00 PM" },
      ].map(({ icon: Icon, label, value, href }) => (
        <div key={label} className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className={labelClass}>{label}</p>
            {href ? (
              <a href={href} className={linkClass}>{value}</a>
            ) : (
              <p className="font-medium text-white/90">{value}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
