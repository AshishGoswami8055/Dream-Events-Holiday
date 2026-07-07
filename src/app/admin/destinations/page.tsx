import { getDestinations } from "@/actions/package.actions";
import { DestinationsAdmin } from "./destinations-admin";
import type { DestinationDocument } from "@/types";

export default async function AdminDestinationsPage() {
  const destinations = await getDestinations();
  return <DestinationsAdmin destinations={destinations as unknown as DestinationDocument[]} />;
}
