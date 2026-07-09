"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminNotificationsBell } from "@/components/admin/admin-notifications";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/packages": "Packages",
  "/admin/packages/new": "New Package",
  "/admin/destinations": "Destinations",
  "/admin/gallery": "Gallery",
  "/admin/inquiries": "Inquiries",
};

function getPageTitle(pathname: string) {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.includes("/admin/packages/") && pathname.endsWith("/edit")) return "Edit Package";
  return "Admin";
}

interface AdminTopbarProps {
  onMenuClick: () => void;
}

export function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-white/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Admin</p>
          <p className="text-sm font-semibold text-foreground sm:text-base">{title}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <AdminNotificationsBell />
        <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
          <Link href="/" target="_blank">
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            View Website
          </Link>
        </Button>
      </div>
    </header>
  );
}
