"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { siteSettingsSchema, type SiteSettingsInput } from "@/lib/validations";
import { updateSiteSettings } from "@/actions/site-settings.actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

interface SiteSettingsFormProps {
  initialData: SiteSettingsInput;
}

export function SiteSettingsForm({ initialData }: SiteSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<SiteSettingsInput>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: initialData,
  });

  const onSubmit = (data: SiteSettingsInput) => {
    startTransition(async () => {
      const result = await updateSiteSettings(data);
      if (result.success) {
        toast({ title: "Saved", description: result.message });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <AdminPageHeader
        title="Site Settings"
        description="Update contact details, email, WhatsApp, and Cloudinary — no need to edit .env files."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Business & Contact</CardTitle>
            <CardDescription>Shown on the website header, footer, and contact page.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Business Name</Label>
              <Input {...register("siteName")} />
              {errors.siteName && <p className="text-sm text-destructive">{errors.siteName.message}</p>}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Website URL</Label>
              <Input {...register("siteUrl")} placeholder="https://yourdomain.com" />
              {errors.siteUrl && <p className="text-sm text-destructive">{errors.siteUrl.message}</p>}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Tagline</Label>
              <Input {...register("tagline")} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Description</Label>
              <Textarea {...register("description")} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" {...register("email")} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input {...register("phone")} placeholder="+91 9023612162" />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp Number</Label>
              <Input {...register("whatsapp")} placeholder="919023612162" />
              <p className="text-xs text-muted-foreground">Country code + number, no + or spaces.</p>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Address</Label>
              <Input {...register("address")} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Facebook</Label>
              <Input {...register("socialFacebook")} placeholder="https://facebook.com/..." />
            </div>
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input {...register("socialInstagram")} placeholder="https://instagram.com/..." />
            </div>
            <div className="space-y-2">
              <Label>Twitter / X</Label>
              <Input {...register("socialTwitter")} placeholder="https://twitter.com/..." />
            </div>
            <div className="space-y-2">
              <Label>YouTube</Label>
              <Input {...register("socialYoutube")} placeholder="https://youtube.com/..." />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Email Notifications (Gmail SMTP)</CardTitle>
            <CardDescription>
              Admin gets an email when someone submits a contact or package inquiry.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>SMTP Host</Label>
              <Input {...register("smtpHost")} placeholder="smtp.gmail.com" />
            </div>
            <div className="space-y-2">
              <Label>SMTP Port</Label>
              <Input type="number" {...register("smtpPort")} placeholder="587" />
            </div>
            <div className="space-y-2">
              <Label>Gmail Address</Label>
              <Input {...register("smtpUser")} placeholder="dreamevents.holidays@gmail.com" />
            </div>
            <div className="space-y-2">
              <Label>Gmail App Password</Label>
              <Input type="password" {...register("smtpPass")} placeholder="Leave blank to keep current" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Send Emails From</Label>
              <Input {...register("smtpFrom")} placeholder='Dream Event & Holidays <email@gmail.com>' />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Admin Notification Email</Label>
              <Input {...register("adminNotificationEmail")} placeholder="Where inquiry alerts are sent" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Cloudinary (Image Uploads)</CardTitle>
            <CardDescription>Required for uploading package and gallery images in admin.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Cloud Name</Label>
              <Input {...register("cloudinaryCloudName")} />
            </div>
            <div className="space-y-2">
              <Label>Upload Preset</Label>
              <Input {...register("cloudinaryUploadPreset")} />
            </div>
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input {...register("cloudinaryApiKey")} />
            </div>
            <div className="space-y-2">
              <Label>API Secret</Label>
              <Input type="password" {...register("cloudinaryApiSecret")} placeholder="Leave blank to keep current" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
          <CardContent className="pt-6 text-sm text-amber-900">
            <p className="font-medium">Stays in .env only (not editable here)</p>
            <p className="mt-1 text-amber-800">
              MongoDB connection, admin login secret (AUTH_SECRET), and server URL — these are set once
              in <code className="rounded bg-amber-100 px-1">.env.local</code> or Vercel and rarely change.
            </p>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isPending} className="min-w-[160px]">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Settings
        </Button>
      </form>
    </div>
  );
}
