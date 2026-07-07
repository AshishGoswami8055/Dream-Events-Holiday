import { getGalleryItems } from "@/actions/package.actions";
import { GalleryAdmin } from "./gallery-admin";
import type { GalleryDocument } from "@/types";

export default async function AdminGalleryPage() {
  const items = await getGalleryItems();
  return <GalleryAdmin items={items as unknown as GalleryDocument[]} />;
}
