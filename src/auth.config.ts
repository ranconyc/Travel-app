import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

// Notice this is just a configuration object
export default {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        console.log("google profile", profile);
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture || null,
        };
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "public_profile",
        },
      },
      profile(profile) {
        console.log("facebook profile", profile);
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email || null,
          image: profile.picture?.data?.url || null,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        // We'll move the heavy bcrypt logic into the main auth.ts
        // that won't be imported by the middleware
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
