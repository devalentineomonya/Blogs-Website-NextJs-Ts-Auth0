import { NextResponse } from "next/server"
import { getSession } from "@auth0/nextjs-auth0/edge"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const session = await getSession(req, res)

  // Check if the request is for the admin area
  if (req.nextUrl.pathname.startsWith("/admin")) {
    // If no session exists, redirect to login
    if (!session?.user) {
      return NextResponse.redirect(new URL("/api/auth/login", req.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*"],
}

