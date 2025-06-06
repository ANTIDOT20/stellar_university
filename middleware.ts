import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

const PROTECTED_PREFIXES = ["/portal/student", "/portal/lecturer", "/portal/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("su_session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/portal", req.url));
  }

  try {
    const payload = await verifySessionToken(token);

    if (pathname.startsWith("/portal/admin") && payload.role !== "admin" && payload.role !== "super_admin") {
      return NextResponse.redirect(new URL("/portal/student", req.url));
    }
    if (pathname.startsWith("/portal/lecturer") && payload.role !== "lecturer" && payload.role !== "admin" && payload.role !== "super_admin") {
      return NextResponse.redirect(new URL("/portal/student", req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/portal", req.url));
  }
}

export const config = {
  matcher: ["/portal/student/:path*", "/portal/lecturer/:path*", "/portal/admin/:path*"],
};
