"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { alertApi } from "@/lib/alert-api";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Alert {
  _id: string;
  message: string;
  productId: { name: string };
}

export default function AlertsDropdown() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await alertApi.getAlerts();
        const data = await res.json();
        setAlerts(data?.alerts ?? []);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {alerts.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-xs"
            >
              {alerts.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Low Stock Alerts</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {loading && <DropdownMenuItem disabled>Loading...</DropdownMenuItem>}

        {!loading && alerts.length === 0 && (
          <DropdownMenuItem disabled>No alerts</DropdownMenuItem>
        )}

        {alerts.map((alert) => (
          <DropdownMenuItem key={alert._id} className="text-sm">
            {alert.message}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
