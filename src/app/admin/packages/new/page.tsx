import { getDestinations } from "@/actions/package.actions";
import { PackageForm } from "@/components/admin/package-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import type { DestinationDocument } from "@/types";

export default async function NewPackagePage() {
  const destinations = await getDestinations();
  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="Add New Package"
        description="Just the essentials — title, destination, price, photo, and description."
        backHref="/admin/packages"
        backLabel="All Packages"
      />
      <PackageForm destinations={destinations as unknown as DestinationDocument[]} />
    </div>
  );
}
