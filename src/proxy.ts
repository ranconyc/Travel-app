import { withAuth } from "next-auth/middleware";

export default withAuth(
  function proxy() {
    console.log("Middleware runing");
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        console.log("Middleware", req.nextUrl.pathname, token);
        // Protect Admin Routes
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "ADMIN";
        }
        // Default: just require authentication for other protected routes
        return !!token;
      },
    },
    pages: {
      signIn: "/login", // Redirect here if not authenticated
    },
  }
);

// Define protected routes
export const config = {
  matcher: [
    "/profile/:path*",
    "/admin/:path*",
    "/chat/:path*",
    "/travel/:path*",
    "/interests/:path*",
    "/mates/:path*",
  ],
};
