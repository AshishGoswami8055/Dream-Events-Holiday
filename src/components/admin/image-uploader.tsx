"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { CloudinaryImage } from "@/types";

interface ImageUploaderProps {
  value?: CloudinaryImage;
  onChange: (image: CloudinaryImage | undefined) => void;
  folder?: string;
  label?: string;
}

export function ImageUploader({ value, onChange, folder = "dream-events", label = "Upload Image" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const sigRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
      });

      if (!sigRes.ok) throw new Error("Failed to get upload signature");
      const { cloudName, apiKey, timestamp, signature, folder: uploadFolder } = await sigRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", uploadFolder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");
      const result = await uploadRes.json();

      onChange({
        publicId: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please check Cloudinary configuration.");
    } finally {
      setUploading(false);
    }
  }, [folder, onChange]);

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative inline-block">
          <div className="relative h-32 w-48 overflow-hidden rounded-lg border">
            <Image src={value.url} alt="Uploaded" fill className="object-cover" sizes="192px" />
          </div>
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90"
            aria-label="Remove image"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Upload className="h-6 w-6 text-muted-foreground mb-2" aria-hidden="true" />
              <span className="text-sm text-muted-foreground">{label}</span>
            </>
          )}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      )}
    </div>
  );
}

interface MultiImageUploaderProps {
  value: CloudinaryImage[];
  onChange: (images: CloudinaryImage[]) => void;
  folder?: string;
}

export function MultiImageUploader({ value, onChange, folder = "dream-events" }: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      const sigRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
      });
      const { cloudName, apiKey, timestamp, signature, folder: uploadFolder } = await sigRes.json();

      const newImages: CloudinaryImage[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", String(timestamp));
        formData.append("signature", signature);
        formData.append("folder", uploadFolder);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });
        const result = await uploadRes.json();
        newImages.push({
          publicId: result.public_id,
          url: result.secure_url,
          width: result.width,
          height: result.height,
        });
      }

      onChange([...value, ...newImages]);
    } catch {
      alert("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {value.map((img) => (
          <div key={img.publicId} className="relative">
            <div className="relative h-20 w-20 overflow-hidden rounded-lg border">
              <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
            </div>
            <button
              type="button"
              onClick={() => onChange(value.filter((i) => i.publicId !== img.publicId))}
              className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-white"
              aria-label="Remove"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <label>
        <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
          <span>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Add Images
          </span>
        </Button>
        <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
      </label>
    </div>
  );
}
