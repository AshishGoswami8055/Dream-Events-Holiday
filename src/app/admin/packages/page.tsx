import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getPackages, deletePackage } from "@/actions/package.actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { formatPrice } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";
import type { PackageDocument } from "@/types";

export default async function AdminPackagesPage() {
  const result = await getPackages({ limit: 100, adminMode: true });
  const packages = result.data as unknown as PackageDocument[];

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="Packages"
        description="Create, edit, and publish travel packages for your website."
        action={
          <Button asChild>
            <Link href="/admin/packages/new">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add Package
            </Link>
          </Button>
        }
      />

      {packages.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-white py-16 text-center shadow-sm">
          <p className="mb-4 text-muted-foreground">No packages yet. Create your first one to get started.</p>
          <Button asChild><Link href="/admin/packages/new">Create First Package</Link></Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left">
                  <th className="px-4 py-3 font-medium text-muted-foreground">Package</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Location</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Price</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg._id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                          <Image src={pkg.coverImage.url} alt={pkg.title} fill className="object-cover" sizes="64px" />
                        </div>
                        <div>
                          <p className="font-medium">{pkg.title}</p>
                          {pkg.featured && <Badge variant="accent" className="mt-1 text-xs">Featured</Badge>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{pkg.location}</td>
                    <td className="px-4 py-4 font-medium">{formatPrice(pkg.price)}</td>
                    <td className="px-4 py-4">
                      <Badge variant={pkg.status === "published" ? "default" : "secondary"} className="capitalize">
                        {pkg.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1">
                        <Button asChild variant="ghost" size="icon" title="Edit package">
                          <Link href={`/admin/packages/${pkg._id}/edit`} aria-label={`Edit ${pkg.title}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteButton
                          id={pkg._id}
                          action={deletePackage}
                          label={pkg.title}
                          icon={<Trash2 className="h-4 w-4 text-destructive" />}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
