import "next-auth";
import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    securityVersion?: number;
    invalidated?: boolean;
  }
}

declare module "next-auth" {
  interface User {
    securityVersion?: number;
  }
  interface Session {
    user: {
      id: string;
    } & Session["user"];
  }
}
