import { getPackageById, getDestinations } from "@/actions/package.actions";
import { notFound } from "next/navigation";
import { PackageForm } from "@/components/admin/package-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import type { PackageDocument, DestinationDocument } from "@/types";

interface EditPackagePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPackagePage({ params }: EditPackagePageProps) {
  const { id } = await params;
  const [pkg, destinations] = await Promise.all([
    getPackageById(id),
    getDestinations(),
  ]);

  if (!pkg) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="Edit Package"
        description="Update package details, images, and itinerary."
        backHref="/admin/packages"
        backLabel="All Packages"
      />
      <PackageForm
        destinations={destinations as unknown as DestinationDocument[]}
        initialData={pkg as unknown as PackageDocument}
      />
    </div>
  );
}
