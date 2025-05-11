"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, Clock, History, Home, Menu, Settings, Wallet, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export default function MobileNav() {
  const [open, setOpen] = useState(false)
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
      href: "/activity",
      label: "活動",
      icon: <Clock className="h-5 w-5" />,
      active: pathname === "/activity",
    },
    {
      href: "/settings",
      label: "設定",
      icon: <Settings className="h-5 w-5" />,
      active: pathname === "/settings",
    },
  ]

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">打開選單</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <div className="flex items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
              <Wallet className="h-6 w-6" />
              <span>Portfolio Tracker</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">關閉選單</span>
            </Button>
          </div>
          <nav className="mt-8 flex flex-col gap-2 px-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                  route.active ? "bg-primary text-primary-foreground" : "hover:bg-muted transition-colors",
                )}
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}
