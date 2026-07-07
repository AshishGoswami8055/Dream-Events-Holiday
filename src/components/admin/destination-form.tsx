"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { destinationSchema, type DestinationInput } from "@/lib/validations";
import { createDestination, updateDestination } from "@/actions/package.actions";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/admin/image-uploader";
import { useToast } from "@/hooks/use-toast";
import type { DestinationDocument, CloudinaryImage } from "@/types";

interface DestinationFormProps {
  initialData?: DestinationDocument;
  onSuccess?: () => void;
}

export function DestinationForm({ initialData, onSuccess }: DestinationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<DestinationInput>({
    resolver: zodResolver(destinationSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      slug: initialData.slug,
      country: initialData.country,
      description: initialData.description,
      image: initialData.image,
      featured: initialData.featured,
    } : { featured: false },
  });

  const onSubmit = (data: DestinationInput) => {
    startTransition(async () => {
      const cleaned = { ...data, slug: data.slug || slugify(data.name) };
      const result = initialData
        ? await updateDestination(initialData._id, cleaned)
        : await createDestination(cleaned);

      if (result.success) {
        toast({ title: "Success", description: result.message });
        onSuccess?.();
        router.refresh();
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Name *</Label>
        <Input {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label>Country *</Label>
        <Input {...register("country")} />
      </div>
      <div className="space-y-2">
        <Label>Description *</Label>
        <Textarea {...register("description")} rows={3} />
      </div>
      <div className="space-y-2">
        <Label>Image *</Label>
        <ImageUploader
          value={watch("image") as CloudinaryImage | undefined}
          onChange={(img) => setValue("image", img!)}
        />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="featured" {...register("featured")} className="rounded" />
        <Label htmlFor="featured">Featured Destination</Label>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : initialData ? "Update" : "Create"}
      </Button>
    </form>
  );
}
