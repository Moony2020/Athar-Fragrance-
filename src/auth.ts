import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authorizeCredentials } from "@/server/auth/credentials";
import { mergeGuestCommerceForUser } from "@/server/commerce/reconciliation";
import { readGuestCartId } from "@/server/commerce/guest-cookie";
import { readGuestWishlistId } from "@/server/commerce/guest-wishlist-cookie";
import { MongoCredentialRepository } from "@/server/identity/credential-repository";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [Credentials({
    name: "Email and password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = typeof credentials?.email === "string" ? credentials.email : "";
      const password = typeof credentials?.password === "string" ? credentials.password : "";
      if (!email || !password) return null;
      return authorizeCredentials(email, password);
    },
  })],
  callbacks: {
    async signIn({ user }) {
      if (!user?.id) return false;
      try {
        await mergeGuestCommerceForUser(user.id, { cartId: await readGuestCartId(), wishlistId: await readGuestWishlistId() });
        return true;
      } catch {
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
        token.securityVersion = typeof user.securityVersion === "number" ? user.securityVersion : 0;
      }
      if (token.sub) {
        const current = await new MongoCredentialRepository().isSessionCurrent(token.sub, typeof token.securityVersion === "number" ? token.securityVersion : 0);
        if (!current) {
          delete token.sub;
          delete token.securityVersion;
          token.invalidated = true;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub && token.invalidated !== true) session.user.id = token.sub;
      return session;
    },
  },
});
