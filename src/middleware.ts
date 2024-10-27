import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuth = request.cookies.get("auth");
  const isAdmin = request.cookies.get("isAdmin");

  // Public paths that don't require authentication
  const publicPaths = ["/login", "/register"];

  // Admin paths
  const adminRoutes = ["/admin"];

  // If the user is not authenticated and trying to access a protected route
  if (!isAuth && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If the user is authenticated and trying to access login/register
  if (isAuth && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the user is an admin and trying to access a non-admin route
  if (isAdmin && !adminRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // If the user is not an admin and trying to access an admin route
  if (!isAdmin && adminRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
