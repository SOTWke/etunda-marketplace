import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
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

        // TODO: Verify credentials against database
        // const user = await db.users.findUnique({ where: { email: credentials.email } });
        // if (!user || !await verifyPassword(credentials.password, user.password)) {
        //   throw new Error("Invalid credentials");
        // }

        // For MVP: demo users
        const demoUsers: Record<string, any> = {
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

        const user = demoUsers[credentials.email];
        if (user && credentials.password === "demo123") {
          return user;
        }

        throw new Error("Invalid email or password");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
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
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

export const { handlers, auth } = NextAuth(authOptions);
