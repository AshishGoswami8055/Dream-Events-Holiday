"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { ActionResponse } from "@/types";

interface DeleteButtonProps {
  id: string;
  action: (id: string) => Promise<ActionResponse>;
  label: string;
  icon?: React.ReactNode;
}

export function DeleteButton({ id, action, label, icon }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete "${label}"?`)) return;

    startTransition(async () => {
      const result = await action(id);
      if (result.success) {
        toast({ title: "Deleted", description: result.message });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isPending} aria-label={`Delete ${label}`}>
      {icon}
    </Button>
  );
}
