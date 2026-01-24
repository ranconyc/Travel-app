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
    // Sync provider image to avatarUrl on user creation
    createUser: async ({ user }) => {
      if (user.image && !(user as any).avatarUrl) {
        await prisma.user.update({
          where: { id: user.id },
          data: { avatarUrl: user.image },
        });
      }
    },
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.uid = user.id;
        token.role = (user as any).role;
        token.currentCityId = (user as any).currentCityId;
        token.profileCompleted = (user as any).profileCompleted;
      }

      // Always refresh profileCompleted from DB to avoid stale cache
      // This is especially important after persona/profile updates
      if (token.uid && (trigger === "update" || !token.role)) {
        const u = await prisma.user.findUnique({
          where: { id: token.uid as string },
          select: { role: true, currentCityId: true, profileCompleted: true },
        });
        token.role = u?.role ?? "USER";
        token.currentCityId = u?.currentCityId ?? undefined;
        token.profileCompleted = u?.profileCompleted ?? false;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string;
        (session.user as any).role = token.role as string;
        (session.user as any).currentCityId = token.currentCityId as string;
        (session.user as any).profileCompleted =
          token.profileCompleted as boolean;
      }
      return session;
    },
  },
});
