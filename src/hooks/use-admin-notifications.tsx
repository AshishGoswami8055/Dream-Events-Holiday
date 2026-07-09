"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export interface AdminNotificationItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: "package" | "contact";
  status: string;
  createdAt: string;
  packageTitle?: string;
}

interface AdminNotificationsState {
  newCount: number;
  latest: AdminNotificationItem[];
  isLoading: boolean;
  lastCheckedAt: string | null;
  refresh: () => Promise<void>;
}

const POLL_INTERVAL_MS = 12_000;
const AdminNotificationsContext = createContext<AdminNotificationsState | null>(null);

function formatNotificationBody(item: AdminNotificationItem) {
  if (item.source === "contact") {
    return item.message.slice(0, 120);
  }
  return item.packageTitle
    ? `Package: ${item.packageTitle}`
    : item.message.slice(0, 120) || "New travel inquiry";
}

export function AdminNotificationsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { toast } = useToast();
  const [newCount, setNewCount] = useState(0);
  const [latest, setLatest] = useState<AdminNotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);
  const knownIdsRef = useRef<Set<string>>(new Set());
  const lastSinceRef = useRef<string | null>(null);
  const isMountedRef = useRef(true);

  const isAdminArea = pathname.startsWith("/admin") && pathname !== "/admin/login";

  const showBrowserNotification = useCallback((item: AdminNotificationItem) => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const title =
      item.source === "contact"
        ? `New contact from ${item.name}`
        : `New inquiry from ${item.name}`;

    new Notification(title, {
      body: formatNotificationBody(item),
      icon: "/logo.png",
      tag: `inquiry-${item._id}`,
    });
  }, []);

  const poll = useCallback(async () => {
    if (!isAdminArea) return;

    try {
      const params = new URLSearchParams();
      if (lastSinceRef.current) {
        params.set("since", lastSinceRef.current);
      }

      const res = await fetch(`/api/admin/notifications?${params.toString()}`, {
        cache: "no-store",
      });

      if (!res.ok) return;

      const data = (await res.json()) as {
        newCount: number;
        hasUpdates: boolean;
        latest: AdminNotificationItem[];
        checkedAt: string;
      };

      if (!isMountedRef.current) return;

      setNewCount(data.newCount);
      setLatest(data.latest);
      setLastCheckedAt(data.checkedAt);
      lastSinceRef.current = data.checkedAt;

      const freshItems = data.latest.filter((item) => !knownIdsRef.current.has(item._id));
      if (knownIdsRef.current.size > 0 && freshItems.length > 0) {
        const newest = freshItems[0];
        toast({
          title:
            newest.source === "contact"
              ? `New contact from ${newest.name}`
              : `New inquiry from ${newest.name}`,
          description: formatNotificationBody(newest),
        });
        freshItems.forEach(showBrowserNotification);
      }

      data.latest.forEach((item) => knownIdsRef.current.add(item._id));
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [isAdminArea, showBrowserNotification, toast]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isAdminArea) return;

    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(() => undefined);
      }
    }

    poll();

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const startPolling = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(poll, POLL_INTERVAL_MS);
    };

    const stopPolling = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        poll();
        startPolling();
      }
    };

    startPolling();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isAdminArea, poll]);

  return (
    <AdminNotificationsContext.Provider
      value={{ newCount, latest, isLoading, lastCheckedAt, refresh: poll }}
    >
      {children}
    </AdminNotificationsContext.Provider>
  );
}

export function useAdminNotifications() {
  const context = useContext(AdminNotificationsContext);
  if (!context) {
    throw new Error("useAdminNotifications must be used within AdminNotificationsProvider");
  }
  return context;
}
