"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DestinationForm } from "@/components/admin/destination-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { deleteDestination } from "@/actions/package.actions";
import type { DestinationDocument } from "@/types";

interface DestinationsAdminProps {
  destinations: DestinationDocument[];
}

export function DestinationsAdmin({ destinations }: DestinationsAdminProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="Destinations"
        description="Add and manage travel destinations shown on your website."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4" /> Add Destination</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle>Add Destination</DialogTitle></DialogHeader>
              <DestinationForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        }
      />

      {destinations.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-white py-16 text-center shadow-sm">
          <p className="text-muted-foreground">No destinations yet. Add your first destination to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest) => (
            <div key={dest._id} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="relative aspect-[16/10]">
                <Image src={dest.image.url} alt={dest.name} fill className="object-cover" sizes="300px" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{dest.name}</h3>
                    <p className="text-sm text-muted-foreground">{dest.country}</p>
                  </div>
                  {dest.featured && <Badge variant="accent" className="text-xs">Featured</Badge>}
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{dest.description}</p>
                <div className="mt-4 flex justify-end">
                  <DeleteButton
                    id={dest._id}
                    action={deleteDestination}
                    label={dest.name}
                    icon={<Trash2 className="h-4 w-4 text-destructive" />}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
