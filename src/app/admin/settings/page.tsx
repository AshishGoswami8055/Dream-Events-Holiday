import { getAdminSiteSettings } from "@/actions/site-settings.actions";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { ChangePasswordForm } from "@/components/admin/change-password-form";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Site Settings",
  description: "Manage website contact, email, and integration settings.",
  noIndex: true,
});

export default async function AdminSettingsPage() {
  const settings = await getAdminSiteSettings();
  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <ChangePasswordForm />
      <SiteSettingsForm initialData={settings} />
    </div>
  );
}
