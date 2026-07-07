"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { packageSchema, type PackageInput } from "@/lib/validations";
import { createPackage, updatePackage } from "@/actions/package.actions";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader, MultiImageUploader } from "@/components/admin/image-uploader";
import { PACKAGE_CATEGORIES, PACKAGE_STATUSES } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import type { PackageDocument, DestinationDocument, CloudinaryImage } from "@/types";

interface PackageFormProps {
  destinations: DestinationDocument[];
  initialData?: PackageDocument;
}

export function PackageForm({ destinations, initialData }: PackageFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const isEdit = !!initialData;

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<PackageInput>({
    resolver: zodResolver(packageSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      slug: initialData.slug,
      location: initialData.location,
      destination: typeof initialData.destination === "object" ? initialData.destination._id : initialData.destination,
      price: initialData.price,
      duration: initialData.duration,
      description: initialData.description,
      highlights: initialData.highlights || [],
      includes: initialData.includes || [],
      excludes: initialData.excludes || [],
      itinerary: initialData.itinerary || [],
      featured: initialData.featured,
      images: initialData.images || [],
      coverImage: initialData.coverImage,
      category: initialData.category,
      status: initialData.status,
      faqs: initialData.faqs || [],
      mapEmbedUrl: initialData.mapEmbedUrl || "",
    } : {
      highlights: [""],
      includes: [""],
      excludes: [""],
      itinerary: [{ day: 1, title: "", description: "" }],
      faqs: [],
      images: [],
      featured: false,
      status: "draft",
      category: "Adventure",
    },
  });

  const { fields: itineraryFields, append: appendItinerary, remove: removeItinerary } = useFieldArray({
    control,
    name: "itinerary",
  });

  const title = watch("title");
  const coverImage = watch("coverImage");
  const images = watch("images");

  const onSubmit = (data: PackageInput) => {
    startTransition(async () => {
      const cleaned = {
        ...data,
        highlights: data.highlights.filter(Boolean),
        includes: data.includes.filter(Boolean),
        excludes: data.excludes.filter(Boolean),
        slug: data.slug || slugify(data.title),
      };

      const result = isEdit
        ? await updatePackage(initialData!._id, cleaned)
        : await createPackage(cleaned);

      if (result.success) {
        toast({ title: "Success", description: result.message });
        router.push("/admin/packages");
        router.refresh();
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };

  const addListItem = (field: "highlights" | "includes" | "excludes") => {
    const current = watch(field) || [];
    setValue(field, [...current, ""]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-24">
      <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <p className="text-sm text-muted-foreground">Title, pricing, and package settings</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input {...register("title")} placeholder="Package title" />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input {...register("slug")} placeholder={title ? slugify(title) : "auto-generated"} />
            </div>
            <div className="space-y-2">
              <Label>Location *</Label>
              <Input {...register("location")} placeholder="City, Region" />
            </div>
            <div className="space-y-2">
              <Label>Destination *</Label>
              <Select
                value={watch("destination") || ""}
                onValueChange={(v) => setValue("destination", v)}
              >
                <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
                <SelectContent>
                  {destinations.map((d) => (
                    <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (INR) *</Label>
                <Input type="number" {...register("price")} />
              </div>
              <div className="space-y-2">
                <Label>Duration (Days) *</Label>
                <Input type="number" {...register("duration")} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={watch("category")} onValueChange={(v) => setValue("category", v as PackageInput["category"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PACKAGE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={watch("status")} onValueChange={(v) => setValue("status", v as PackageInput["status"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PACKAGE_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" {...register("featured")} className="rounded" />
              <Label htmlFor="featured">Featured Package</Label>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Images</CardTitle>
            <p className="text-sm text-muted-foreground">Upload a cover image and optional gallery photos</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cover Image *</Label>
              <ImageUploader
                value={coverImage as CloudinaryImage | undefined}
                onChange={(img) => setValue("coverImage", img!)}
                label="Upload cover image"
              />
            </div>
            <div className="space-y-2">
              <Label>Gallery Images</Label>
              <MultiImageUploader
                value={(images as CloudinaryImage[]) || []}
                onChange={(imgs) => setValue("images", imgs)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Description</CardTitle>
          <p className="text-sm text-muted-foreground">Write a compelling overview of this package</p>
        </CardHeader>
        <CardContent>
          <Textarea {...register("description")} rows={6} placeholder="Detailed package description..." />
        </CardContent>
      </Card>

      {(["highlights", "includes", "excludes"] as const).map((field) => (
        <Card key={field} className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="capitalize">{field}</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => addListItem(field)}>
              <Plus className="h-4 w-4" /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {(watch(field) || []).map((_, i) => (
              <Input key={i} {...register(`${field}.${i}`)} placeholder={`${field} item ${i + 1}`} />
            ))}
          </CardContent>
        </Card>
      ))}

      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Itinerary</CardTitle>
            <p className="text-sm text-muted-foreground">Day-by-day plan for travelers</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => appendItinerary({ day: itineraryFields.length + 1, title: "", description: "" })}>
            <Plus className="h-4 w-4" /> Add Day
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {itineraryFields.map((field, index) => (
            <div key={field.id} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Day {index + 1}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeItinerary(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <Input {...register(`itinerary.${index}.title`)} placeholder="Day title" />
              <Textarea {...register(`itinerary.${index}.description`)} placeholder="Day description" rows={2} />
              <input type="hidden" {...register(`itinerary.${index}.day`, { valueAsNumber: true })} value={index + 1} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label>Google Maps Embed URL</Label>
            <Input {...register("mapEmbedUrl")} placeholder="https://www.google.com/maps/embed?..." />
            <p className="text-xs text-muted-foreground">Optional — shows a map on the package detail page</p>
          </div>
        </CardContent>
      </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t bg-white/95 px-4 py-4 backdrop-blur-sm lg:left-64">
        <div className="mx-auto flex max-w-5xl gap-3">
          <Button type="submit" disabled={isPending} className="min-w-[140px]">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : isEdit ? "Save Changes" : "Create Package"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </div>
    </form>
  );
}
