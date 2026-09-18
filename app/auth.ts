import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const demoUsers: Record<string, { id: string; name: string; email: string; role: "buyer" | "farmer" | "admin" }> = {
  "buyer@etunda.com": {
    id: "buyer-1",
    name: "Jane Buyer",
    email: "buyer@etunda.com",
    role: "buyer",
  },
  "farmer@etunda.com": {
    id: "farmer-1",
    name: "John Farmer",
    email: "farmer@etunda.com",
    role: "farmer",
  },
  "admin@etunda.com": {
    id: "admin-1",
    name: "Admin User",
    email: "admin@etunda.com",
    role: "admin",
  },
};

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-me-before-production",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = demoUsers[credentials.email as string];
        if (user && credentials.password === "demo123") {
          return user;
        }

        throw new Error("Invalid email or password");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
  },
};

export const { handlers, auth } = NextAuth(authOptions);
