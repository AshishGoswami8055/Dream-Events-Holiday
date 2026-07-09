"use client";

import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DatePickerField } from "@/components/shared/date-picker-field";
import { inquirySchema, type InquiryInput } from "@/lib/validations";
import { submitInquiry } from "@/actions/inquiry.actions";
import { useToast } from "@/hooks/use-toast";

interface InquiryFormProps {
  packageId?: string;
  packageTitle?: string;
}

export function InquiryForm({ packageId, packageTitle }: InquiryFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      adults: 1,
      children: 0,
      package: packageId,
      travelDate: "",
      message: packageTitle ? `Interested in: ${packageTitle}` : "",
    },
  });

  const onSubmit = (data: InquiryInput) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      const result = await submitInquiry(formData);

      if (result.success) {
        toast({ title: "Success!", description: result.message });
        reset({
          adults: 1,
          children: 0,
          package: packageId,
          travelDate: "",
          message: packageTitle ? `Interested in: ${packageTitle}` : "",
        });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" {...register("name")} placeholder="John Doe" aria-invalid={!!errors.name} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input id="phone" {...register("phone")} placeholder="+91 9023612162" aria-invalid={!!errors.phone} />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" {...register("email")} placeholder="john@example.com" aria-invalid={!!errors.email} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="adults">Adults *</Label>
          <Input id="adults" type="number" min={1} {...register("adults")} aria-invalid={!!errors.adults} />
          {errors.adults && <p className="text-sm text-destructive">{errors.adults.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="children">Children</Label>
          <Input id="children" type="number" min={0} {...register("children")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="travelDate">Travel Date *</Label>
        <Controller
          name="travelDate"
          control={control}
          render={({ field }) => (
            <DatePickerField
              id="travelDate"
              value={field.value}
              onChange={field.onChange}
              placeholder="Pick a date"
              aria-invalid={!!errors.travelDate}
            />
          )}
        />
        {errors.travelDate && <p className="text-sm text-destructive">{errors.travelDate.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" {...register("message")} placeholder="Tell us about your travel preferences..." rows={4} />
      </div>

      {packageId && <input type="hidden" {...register("package")} />}

      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Submitting...
          </>
        ) : (
          "Send Inquiry"
        )}
      </Button>
    </form>
  );
}
