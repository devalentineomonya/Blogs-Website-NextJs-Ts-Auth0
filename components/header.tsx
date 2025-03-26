"use client"

import Link from "next/link"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

export default function Header() {
  const { user, isLoading } = useUser()
  const { theme, setTheme } = useTheme()

  return (
    <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text"
        >
          Modern Blog
        </Link>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </Button>

          {!isLoading && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link href="/admin">
                    <Button variant="ghost">Admin Dashboard</Button>
                  </Link>
                  <Link href="/api/auth/logout">
                    <Button variant="outline">Logout</Button>
                  </Link>
                </div>
              ) : (
                <Link href="/api/auth/login">
                  <Button>Login</Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}

