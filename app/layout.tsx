import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import MainNav from "@/components/main-nav"
import MobileNav from "@/components/mobile-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Wallet } from "lucide-react"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Portfolio Tracker",
  description: "Track your investments across multiple asset classes",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center">
                <MobileNav />
                <div className="mr-4 hidden md:flex">
                  <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Wallet className="h-6 w-6" />
                    <span>Portfolio Tracker</span>
                  </Link>
                </div>
                <MainNav />
                <div className="ml-auto flex items-center space-x-4">
                  <ModeToggle />
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
