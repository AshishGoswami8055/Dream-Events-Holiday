"use client";

import Link from "next/link";
import { Bell, MessageSquare, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAdminNotifications } from "@/hooks/use-admin-notifications";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

function NotificationBadge({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function AdminNotificationsBell() {
  const { newCount, latest, isLoading } = useAdminNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="relative"
          aria-label={`Notifications${newCount > 0 ? `, ${newCount} new` : ""}`}
        >
          <Bell className={cn("h-4 w-4", newCount > 0 && "text-primary")} />
          <NotificationBadge count={newCount} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 sm:w-96">
        <div className="border-b px-4 py-3">
          <p className="font-semibold">Notifications</p>
          <p className="text-xs text-muted-foreground">
            {isLoading
              ? "Checking for new queries..."
              : newCount > 0
                ? `${newCount} new ${newCount === 1 ? "query" : "queries"} waiting`
                : "No new queries right now"}
          </p>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {latest.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              New package inquiries and contact messages will appear here instantly.
            </div>
          ) : (
            latest.map((item) => (
              <div key={item._id} className="border-b px-4 py-3 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {item.source === "contact" ? (
                      <MessageSquare className="h-4 w-4" />
                    ) : (
                      <Package className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.source === "contact" ? "Contact form" : "Package inquiry"}
                      {item.packageTitle ? ` · ${item.packageTitle}` : ""}
                    </p>
                    {item.message && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.message}</p>
                    )}
                    <p className="mt-1 text-[11px] text-muted-foreground">{formatDate(item.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t p-3">
          <Button asChild variant="accent" size="sm" className="w-full">
            <Link href="/admin/inquiries">View All Inquiries</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function AdminSidebarNotificationBadge() {
  const { newCount } = useAdminNotifications();
  if (newCount <= 0) return null;

  return (
    <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
      {newCount > 99 ? "99+" : newCount}
    </span>
  );
}
