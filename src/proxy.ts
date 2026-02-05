import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isAuthPage = nextUrl.pathname === "/signin";
  const isPublicResource = ["/manifest.webmanifest", "/place/"].some((route) =>
    nextUrl.pathname.startsWith(route),
  );

  if (isApiAuthRoute) return NextResponse.next();

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next();
  }

  if (isPublicResource) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/signin", nextUrl));
  }

  const role = (req.auth?.user as any)?.role;
  const needsOnboarding = (req.auth?.user as any)?.needsOnboarding;
  const isBanned = (req.auth?.user as any)?.isBanned;
  const isActive = (req.auth?.user as any)?.isActive;

  // Debug logging for admin route access
  if (nextUrl.pathname.startsWith("/admin")) {
    console.log("Admin route access attempt:", {
      pathname: nextUrl.pathname,
      userId: (req.auth?.user as any)?.id,
      role: role,
      roleType: typeof role,
      isLoggedIn: !!req.auth,
      needsOnboarding,
    });
  }

  // Global Safety Switch
  if (isLoggedIn && (isBanned || isActive === false)) {
    // If it's not the signin page, redirect to signin
    if (nextUrl.pathname !== "/signin") {
      return NextResponse.redirect(new URL("/signin?error=Suspended", nextUrl));
    }
  }

  // Protect Admin Routes
  if (nextUrl.pathname.startsWith("/admin")) {
    // Check role with case-insensitive comparison and fallback
    const userRole = role?.toString().toUpperCase();
    if (userRole !== "ADMIN") {
      console.log("Admin access denied - insufficient role:", {
        role,
        userRole,
      });
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  // Gated Onboarding Logic - Force users to complete onboarding
  const isOnboardingRoute = nextUrl.pathname === "/profile/onboarding";
  if (needsOnboarding && !isOnboardingRoute) {
    return NextResponse.redirect(new URL("/profile/onboarding", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
