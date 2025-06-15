"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { History, Home } from "lucide-react"

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-3">
              EC
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">ELCODERS</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={pathname === "/" ? "default" : "ghost"} size="sm" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>

          <Button variant={pathname === "/history" ? "default" : "ghost"} size="sm" asChild>
            <Link href="/history">
              <History className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">History</span>
            </Link>
          </Button>

          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
