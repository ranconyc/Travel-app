import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = ["/signin", "/manifest.webmanifest"].includes(
    nextUrl.pathname,
  );
  const isOnboardingRoute = nextUrl.pathname.startsWith("/profile/persona");

  if (isApiAuthRoute) return NextResponse.next();

  if (isPublicRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/signin", nextUrl));
  }

  const role = (req.auth?.user as any)?.role;
  const isProfileCompleted = (req.auth?.user as any)?.profileCompleted;
  const isBanned = (req.auth?.user as any)?.isBanned;
  const isActive = (req.auth?.user as any)?.isActive;

  // Global Safety Switch
  if (isLoggedIn && (isBanned || isActive === false)) {
    // If it's not the signin page, redirect to signin
    if (nextUrl.pathname !== "/signin") {
      return NextResponse.redirect(new URL("/signin?error=Suspended", nextUrl));
    }
  }

  // Protect Admin Routes
  if (nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Gated Onboarding Logic
  // if (!isProfileCompleted && !isOnboardingRoute && nextUrl.pathname !== "/") {
  //   return NextResponse.redirect(new URL("/profile/persona", nextUrl));
  // }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
