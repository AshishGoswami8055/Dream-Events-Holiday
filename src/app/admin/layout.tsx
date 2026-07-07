import { AdminLayoutClient } from "@/components/admin/admin-layout-client";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Admin Panel",
  description: "Dream Events & Holiday Admin Panel",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
