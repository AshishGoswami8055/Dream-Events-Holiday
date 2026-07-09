import { generateSEO } from "@/lib/seo";
import { ResetPasswordForm } from "@/components/admin/reset-password-form";

export const metadata = generateSEO({
  title: "Reset Password",
  description: "Set a new admin password.",
  noIndex: true,
});

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({ params }: PageProps) {
  const { token } = await params;
  return <ResetPasswordForm token={token} />;
}
