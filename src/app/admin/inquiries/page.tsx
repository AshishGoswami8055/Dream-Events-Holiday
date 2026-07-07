import { getInquiries } from "@/actions/package.actions";
import { InquiriesAdmin } from "./inquiries-admin";
import type { InquiryDocument } from "@/types";

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();
  return <InquiriesAdmin inquiries={inquiries as unknown as InquiryDocument[]} />;
}
