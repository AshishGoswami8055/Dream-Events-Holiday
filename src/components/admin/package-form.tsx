"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Loader2, Plus, Trash2 } from "lucide-react";
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
import { MapLocationSearch } from "@/components/admin/map-location-search";
import { PACKAGE_CATEGORIES, PACKAGE_STATUSES } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { PackageDocument, DestinationDocument, CloudinaryImage } from "@/types";

interface PackageFormProps {
  destinations: DestinationDocument[];
  initialData?: PackageDocument;
}

const LIST_FIELDS = ["highlights", "includes", "excludes"] as const;

export function PackageForm({ destinations, initialData }: PackageFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showOptional, setShowOptional] = useState(false);
  const { toast } = useToast();
  const isEdit = !!initialData;

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<PackageInput>({
    resolver: zodResolver(packageSchema),
    defaultValues: initialData
      ? {
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
        }
      : {
          highlights: [],
          includes: [],
          excludes: [],
          itinerary: [],
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

  const coverImage = watch("coverImage");
  const images = watch("images");
  const destinationId = watch("destination");
  const mapEmbedUrl = watch("mapEmbedUrl");

  const getDestinationName = (id?: string) =>
    destinations.find((d) => d._id === id)?.name;

  const onSubmit = (data: PackageInput) => {
    startTransition(async () => {
      const destinationName = getDestinationName(data.destination);
      const cleaned: PackageInput = {
        ...data,
        slug: slugify(data.title),
        location: destinationName || data.location || data.title,
        highlights: data.highlights.filter(Boolean),
        includes: data.includes.filter(Boolean),
        excludes: data.excludes.filter(Boolean),
        itinerary: data.itinerary.filter((day) => day.title.trim() && day.description.trim()),
        mapEmbedUrl: data.mapEmbedUrl?.trim() || "",
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

  const addListItem = (field: (typeof LIST_FIELDS)[number]) => {
    const current = watch(field) || [];
    setValue(field, [...current, ""]);
  };

  const removeListItem = (field: (typeof LIST_FIELDS)[number], index: number) => {
    const current = watch(field) || [];
    setValue(
      field,
      current.filter((_, i) => i !== index)
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-24">
      <div className="space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Package Details</CardTitle>
            <p className="text-sm text-muted-foreground">
              Only the essentials — title, destination, price, image, and description.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Package Title *</Label>
              <Input {...register("title")} placeholder="e.g. Kerala Backwaters Escape" />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Destination *</Label>
                <Select value={destinationId || ""} onValueChange={(v) => setValue("destination", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((d) => (
                      <SelectItem key={d._id} value={d._id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.destination && (
                  <p className="text-sm text-destructive">{errors.destination.message}</p>
                )}
                {destinationId && (
                  <p className="text-xs text-muted-foreground">
                    Location on website: {getDestinationName(destinationId)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={watch("category")}
                  onValueChange={(v) => setValue("category", v as PackageInput["category"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PACKAGE_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Price (₹) *</Label>
                <Input type="number" {...register("price")} placeholder="25000" />
                {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Duration (Days) *</Label>
                <Input type="number" {...register("duration")} placeholder="5" />
                {errors.duration && (
                  <p className="text-sm text-destructive">{errors.duration.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cover Image *</Label>
              <ImageUploader
                value={coverImage as CloudinaryImage | undefined}
                onChange={(img) => setValue("coverImage", img!)}
                label="Upload main package photo"
              />
              {errors.coverImage && (
                <p className="text-sm text-destructive">Cover image is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                {...register("description")}
                rows={5}
                placeholder="Describe the trip — where it goes, what travelers will experience, and why they should book."
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={watch("status")}
                  onValueChange={(v) => setValue("status", v as PackageInput["status"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PACKAGE_STATUSES.filter((s) => s !== "archived").map((s) => (
                      <SelectItem key={s} value={s}>
                        {s === "draft" ? "Draft (hidden)" : "Published (live)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end pb-2">
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" {...register("featured")} className="rounded" />
                  <span className="text-sm font-medium">Show on homepage as featured</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <button
            type="button"
            onClick={() => setShowOptional((open) => !open)}
            className="flex w-full items-center justify-between px-6 py-5 text-left"
          >
            <div>
              <CardTitle className="text-base">Optional Details</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Highlights, inclusions, day plan, extra photos, and map — add only if needed.
              </p>
            </div>
            <ChevronDown
              className={cn("h-5 w-5 shrink-0 text-muted-foreground transition-transform", showOptional && "rotate-180")}
              aria-hidden="true"
            />
          </button>

          {showOptional && (
            <CardContent className="space-y-6 border-t pt-6">
              {LIST_FIELDS.map((field) => {
                const items = watch(field) || [];
                return (
                  <div key={field} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="capitalize text-base">{field}</Label>
                      <Button type="button" variant="outline" size="sm" onClick={() => addListItem(field)}>
                        <Plus className="h-4 w-4" /> Add
                      </Button>
                    </div>
                    {items.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No items added yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {items.map((_, i) => (
                          <div key={i} className="flex gap-2">
                            <Input {...register(`${field}.${i}`)} placeholder={`${field} item ${i + 1}`} />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeListItem(field, i)}
                              aria-label={`Remove ${field} item`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Day-wise Itinerary</Label>
                    <p className="text-sm text-muted-foreground">Add only if you want a day-by-day plan.</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      appendItinerary({
                        day: itineraryFields.length + 1,
                        title: "",
                        description: "",
                      })
                    }
                  >
                    <Plus className="h-4 w-4" /> Add Day
                  </Button>
                </div>
                {itineraryFields.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No itinerary days added yet.</p>
                ) : (
                  <div className="space-y-3">
                    {itineraryFields.map((field, index) => (
                      <div key={field.id} className="rounded-lg border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Day {index + 1}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeItinerary(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <Input {...register(`itinerary.${index}.title`)} placeholder="Day title" />
                        <Textarea
                          {...register(`itinerary.${index}.description`)}
                          placeholder="What happens on this day?"
                          rows={2}
                        />
                        <input
                          type="hidden"
                          {...register(`itinerary.${index}.day`, { valueAsNumber: true })}
                          value={index + 1}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Extra Gallery Photos</Label>
                <MultiImageUploader
                  value={(images as CloudinaryImage[]) || []}
                  onChange={(imgs) => setValue("images", imgs)}
                />
              </div>

              <MapLocationSearch
                value={mapEmbedUrl}
                onChange={(url) => setValue("mapEmbedUrl", url, { shouldDirty: true })}
              />
            </CardContent>
          )}
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t bg-white/95 px-4 py-4 backdrop-blur-sm lg:left-64">
        <div className="mx-auto flex max-w-5xl gap-3">
          <Button type="submit" disabled={isPending} className="min-w-[140px]">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create Package"
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
