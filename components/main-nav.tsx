"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, History, Home, Settings, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "儀表板",
      icon: <Home className="h-5 w-5" />,
      active: pathname === "/",
    },
    {
      href: "/assets",
      label: "資產",
      icon: <Wallet className="h-5 w-5" />,
      active: pathname === "/assets",
    },
    {
      href: "/history",
      label: "交易記錄",
      icon: <History className="h-5 w-5" />,
      active: pathname === "/history",
    },
    {
      href: "/analytics",
      label: "分析",
      icon: <BarChart2 className="h-5 w-5" />,
      active: pathname === "/analytics",
    },
    {
      href: "/settings",
      label: "設定",
      icon: <Settings className="h-5 w-5" />,
      active: pathname === "/settings",
    },
  ]

  return (
    <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-primary" : "text-muted-foreground",
          )}
        >
          {route.icon}
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
