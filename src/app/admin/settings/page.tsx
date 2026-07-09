import { getAdminSiteSettings } from "@/actions/site-settings.actions";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Site Settings",
  description: "Manage website contact, email, and integration settings.",
  noIndex: true,
});

export default async function AdminSettingsPage() {
  const settings = await getAdminSiteSettings();
  return <SiteSettingsForm initialData={settings} />;
}
