import { generateSEO } from "@/lib/seo";
import ForgotPasswordPage from "./page-client";

export const metadata = generateSEO({
  title: "Forgot Password",
  description: "Reset your admin password via email.",
  noIndex: true,
});

export default function Page() {
  return <ForgotPasswordPage />;
}
