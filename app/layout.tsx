import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { UserProvider } from "@auth0/nextjs-auth0/client"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Modern Blog",
  description: "A modern blog built with Next.js, PostgreSQL, Drizzle ORM, and Hono",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <UserProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-background via-background/90">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  )
}



import './globals.css'