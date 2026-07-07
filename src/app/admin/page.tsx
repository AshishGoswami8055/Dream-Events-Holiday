import { Package, MessageSquare, MapPin, Image, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import { getDashboardStats } from "@/actions/package.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { formatDate } from "@/lib/utils";
import type { DashboardStats, InquiryDocument } from "@/types";

export default async function AdminDashboardPage() {
  const stats = (await getDashboardStats()) as unknown as DashboardStats;

  const statCards = [
    { label: "Total Packages", value: stats.totalPackages, icon: Package, href: "/admin/packages", color: "bg-blue-50 text-blue-600" },
    { label: "Published", value: stats.publishedPackages, icon: TrendingUp, href: "/admin/packages", color: "bg-green-50 text-green-600" },
    { label: "New Inquiries", value: stats.newInquiries, icon: MessageSquare, href: "/admin/inquiries", color: "bg-orange-50 text-orange-600" },
    { label: "Destinations", value: stats.totalDestinations, icon: MapPin, href: "/admin/destinations", color: "bg-purple-50 text-purple-600" },
    { label: "Gallery Items", value: stats.totalGallery, icon: Image, href: "/admin/gallery", color: "bg-pink-50 text-pink-600" },
    { label: "Total Inquiries", value: stats.totalInquiries, icon: MessageSquare, href: "/admin/inquiries", color: "bg-indigo-50 text-indigo-600" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="Dashboard"
        description="Welcome back! Here's a quick overview of your travel business."
        action={
          <Button asChild>
            <Link href="/admin/packages/new">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add Package
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href}>
            <Card className="border-0 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-8 border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentInquiries.length === 0 ? (
            <div className="rounded-xl border border-dashed py-12 text-center">
              <p className="text-muted-foreground">No inquiries yet. They will appear here when customers submit forms.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-left text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Package</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats.recentInquiries as InquiryDocument[]).map((inquiry) => (
                    <tr key={inquiry._id} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium">{inquiry.name}</td>
                      <td className="px-4 py-3">{inquiry.email}</td>
                      <td className="px-4 py-3">
                        {typeof inquiry.package === "object" && inquiry.package
                          ? (inquiry.package as { title: string }).title
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          inquiry.status === "new" ? "bg-orange-100 text-orange-700" :
                          inquiry.status === "confirmed" ? "bg-green-100 text-green-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {inquiry.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(inquiry.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
