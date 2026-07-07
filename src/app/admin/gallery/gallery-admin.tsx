"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { gallerySchema, type GalleryInput } from "@/lib/validations";
import { createGalleryItem, deleteGalleryItem } from "@/actions/package.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageUploader } from "@/components/admin/image-uploader";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import type { GalleryDocument, CloudinaryImage } from "@/types";

interface GalleryAdminProps {
  items: GalleryDocument[];
}

export function GalleryAdmin({ items }: GalleryAdminProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const { register, handleSubmit, watch, setValue, reset } = useForm<GalleryInput>({
    resolver: zodResolver(gallerySchema),
    defaultValues: { featured: false, category: "General", order: 0 },
  });

  const onSubmit = (data: GalleryInput) => {
    startTransition(async () => {
      const result = await createGalleryItem(data);
      if (result.success) {
        toast({ title: "Success", description: result.message });
        reset();
        setOpen(false);
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="Gallery"
        description="Upload and manage photos shown on your website gallery."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4" /> Add Image</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle>Add Gallery Image</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input {...register("title")} placeholder="e.g. Sunset in Maldives" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input {...register("category")} placeholder="Beach, Adventure, etc." />
                </div>
                <div className="space-y-2">
                  <Label>Image</Label>
                  <ImageUploader
                    value={watch("image") as CloudinaryImage | undefined}
                    onChange={(img) => setValue("image", img!)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" {...register("featured")} className="rounded" id="gallery-featured" />
                  <Label htmlFor="gallery-featured">Show on homepage</Label>
                </div>
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add to Gallery"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-white py-16 text-center shadow-sm">
          <p className="text-muted-foreground">No gallery images yet. Click &quot;Add Image&quot; to upload your first photo.</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item._id} className="group relative overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="relative aspect-square">
              <Image src={item.image.url} alt={item.title} fill className="object-cover" sizes="200px" />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium truncate">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.category}</p>
            </div>
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <DeleteButton id={item._id} action={deleteGalleryItem} label={item.title} icon={<Trash2 className="h-4 w-4 text-destructive" />} />
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
