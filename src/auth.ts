import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcrypt";
import authConfig from "./auth.config";
import CredentialsProvider from "next-auth/providers/credentials";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  providers: [
    ...authConfig.providers.filter((p) => p.id !== "credentials"),
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        return valid ? user : null;
      },
    }),
  ],
  events: {
    // Sync provider image and split name to profile on user creation
    createUser: async ({ user }) => {
      const updates: { avatarUrl?: string } = {};

      // Sync avatar from OAuth provider
      if (user.image && !(user as any).avatarUrl) {
        updates.avatarUrl = user.image;
      }

      // Split OAuth name into firstName/lastName
      let firstName: string | undefined;
      let lastName: string | undefined;

      if (user.name) {
        const parts = user.name.trim().split(/\s+/);
        firstName = parts[0];
        lastName = parts.length > 1 ? parts.slice(1).join(" ") : undefined;
      }

      // Update user and create profile in a single transaction
      await prisma.user.update({
        where: { id: user.id },
        data: {
          ...updates,
          profile: {
            upsert: {
              create: {
                firstName,
                lastName,
              },
              update: {
                firstName: firstName || undefined,
                lastName: lastName || undefined,
              },
            },
          },
        },
      });
    },
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.uid = user.id;
        token.role = (user as any).role;
        token.currentCityId = (user as any).currentCityId;
        token.isBanned = (user as any).isBanned;
        token.isActive = (user as any).isActive;
      }

      // Always refresh security, status, and onboarding flags from DB
      if (token.uid && (trigger === "update" || !token.role)) {
        const u = await prisma.user.findUnique({
          where: { id: token.uid as string },
          select: {
            role: true,
            currentCityId: true,
            name: true,
            avatarUrl: true,
            isBanned: true,
            isActive: true,
            profile: {
              select: {
                firstName: true,
                homeBaseCityId: true,
                birthday: true,
                gender: true,
              },
            },
          },
        });

        token.role = u?.role ?? "USER";
        token.currentCityId = u?.currentCityId ?? undefined;
        token.isBanned = u?.isBanned ?? false;
        token.isActive = u?.isActive ?? true;

        // Compute needsOnboarding based on actual missing fields
        const hasName = !!u?.profile?.firstName; // Only check profile.firstName
        const hasAvatar = !!u?.avatarUrl;
        const hasHomeBase = !!u?.profile?.homeBaseCityId;
        const hasBirthday = !!u?.profile?.birthday;
        const hasGender = !!u?.profile?.gender;

        token.needsOnboarding = !(
          hasName &&
          hasAvatar &&
          hasHomeBase &&
          hasBirthday &&
          hasGender
        );
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string;
        (session.user as any).role = token.role as string;
        (session.user as any).currentCityId = token.currentCityId as string;
        (session.user as any).needsOnboarding =
          token.needsOnboarding as boolean;
        (session.user as any).isBanned = token.isBanned as boolean;
        (session.user as any).isActive = token.isActive as boolean;
      }
      return session;
    },
  },
});
