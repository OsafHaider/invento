"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { alertApi } from "@/lib/alert-api"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Alert {
  _id: string
  message: string
  productId: { name: string }
  isRead?: boolean
}

export default function AlertsDropdown() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      const data = await alertApi.getAlerts()
      setAlerts(data.data?? [])
    } catch (error) {
      console.error("Failed to fetch alerts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await alertApi.markAsRead(id)

      // optimistic update
      setAlerts(prev =>
        prev.map(alert =>
          alert._id === id ? { ...alert, isRead: true } : alert
        )
      )
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await alertApi.markAllAsRead()

      setAlerts(prev =>
        prev.map(alert => ({ ...alert, isRead: true }))
      )
    } catch (error) {
      console.error("Failed to mark all as read:", error)
    }
  }

  const unreadCount = alerts.filter(a => !a.isRead).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          Low Stock Alerts
          {alerts.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
            >
              Mark all
            </Button>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {loading && (
          <DropdownMenuItem disabled>
            Loading...
          </DropdownMenuItem>
        )}

        {!loading && alerts.length === 0 && (
          <DropdownMenuItem disabled>
            No alerts
          </DropdownMenuItem>
        )}

        {alerts.map(alert => (
          <DropdownMenuItem
            key={alert._id}
            onClick={() => handleMarkAsRead(alert._id)}
            className={`text-sm cursor-pointer ${
              !alert.isRead ? "font-semibold" : ""
            }`}
          >
            {alert.message}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
