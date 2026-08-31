import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { authConfig } from "./auth.config";
import { getConnectedMongoClient } from "./lib/db/mongodb";
import { isAdminEmail } from "./lib/auth/admin";

declare module "next-auth" {
  interface Session {
    user: {
      role?: "admin" | "user";
    } & DefaultSession["user"];
  }
  interface User {
    role?: "admin" | "user";
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: "admin" | "user";
  }
}

const hasMongo = !!process.env.MONGODB_URI;

const providers = [
  ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
    ? [
        Google({
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
      ]
    : []),
  ...(process.env.AUTH_RESEND_KEY
    ? [
        Resend({
          apiKey: process.env.AUTH_RESEND_KEY,
          from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        }),
      ]
    : []),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: hasMongo ? MongoDBAdapter(() => getConnectedMongoClient()) : undefined,
  providers,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      // On sign-in, user is present. On subsequent calls it isn't.
      const email = (user?.email ?? token.email) as string | undefined;
      const role: "admin" | "user" = isAdminEmail(email) ? "admin" : "user";
      token.role = role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as "admin" | "user" | undefined) ?? "user";
      }
      return session;
    },
  },
});
