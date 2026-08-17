import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      email?: string;
      role: "buyer" | "farmer" | "admin";
    };
  }

  interface User {
    id: string;
    role: "buyer" | "farmer" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "buyer" | "farmer" | "admin";
  }
}
