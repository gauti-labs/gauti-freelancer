import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config. Used by the Next.js middleware.
 * Providers and adapter live in ./auth.ts (Node runtime).
 */
export const authConfig = {
  pages: {
    signIn: "/signin",
    verifyRequest: "/verify-request",
    error: "/signin",
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;
      const isProtectedClient = path.startsWith("/client");
      const isProtectedAdmin = path.startsWith("/admin");
      const isAuthPage = path.startsWith("/signin") || path.startsWith("/verify-request");

      if (isProtectedAdmin) {
        return isLoggedIn && auth?.user?.role === "admin";
      }
      if (isProtectedClient) {
        return isLoggedIn;
      }
      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/client", nextUrl));
      }
      return true;
    },
  },
  providers: [], // Populated in auth.ts
} satisfies NextAuthConfig;
