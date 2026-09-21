import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authorizeCredentials } from "@/server/auth/credentials";
import { mergeGuestCommerceForUser } from "@/server/commerce/reconciliation";
import { readGuestCartId } from "@/server/commerce/guest-cookie";
import { readGuestWishlistId } from "@/server/commerce/guest-wishlist-cookie";

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
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
