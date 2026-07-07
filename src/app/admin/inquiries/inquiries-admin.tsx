"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { updateInquiryStatus, deleteInquiry } from "@/actions/package.actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { INQUIRY_STATUSES } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import type { InquiryDocument } from "@/types";

interface InquiriesAdminProps {
  inquiries: InquiryDocument[];
}

export function InquiriesAdmin({ inquiries }: InquiriesAdminProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleStatusChange = (id: string, status: string) => {
    startTransition(async () => {
      const result = await updateInquiryStatus(id, status);
      if (result.success) {
        toast({ title: "Updated", description: result.message });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="Inquiries"
        description="View and manage customer booking requests and contact messages."
      />

      {inquiries.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-white py-16 text-center shadow-sm">
          <p className="text-muted-foreground">No inquiries yet. Customer requests will show up here.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Contact</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Travel Details</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Package</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry._id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-4">
                    <p className="font-medium">{inquiry.name}</p>
                    <p className="text-muted-foreground">{inquiry.email}</p>
                    <p className="text-muted-foreground">{inquiry.phone}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p>{inquiry.adults} Adults, {inquiry.children} Children</p>
                    <p className="text-muted-foreground">{formatDate(inquiry.travelDate)}</p>
                    {inquiry.message && <p className="mt-1 line-clamp-2 text-xs">{inquiry.message}</p>}
                  </td>
                  <td className="px-4 py-4">
                    {typeof inquiry.package === "object" && inquiry.package
                      ? (inquiry.package as { title: string }).title
                      : "—"}
                  </td>
                  <td className="px-4 py-4">
                    <Select
                      value={inquiry.status}
                      onValueChange={(v) => handleStatusChange(inquiry._id, v)}
                      disabled={isPending}
                    >
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {INQUIRY_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">{formatDate(inquiry.createdAt)}</td>
                  <td className="px-4 py-4">
                    <DeleteButton
                      id={inquiry._id}
                      action={deleteInquiry}
                      label={inquiry.name}
                      icon={<Trash2 className="h-4 w-4 text-destructive" />}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
