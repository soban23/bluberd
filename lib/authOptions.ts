import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { getUserByEmail, createUser } from "@/lib/db/users";
import imageUrlToBuffer from "@/helper/buffer";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      username?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string | null;
    };
  }
  interface User {
    id?: string;
    username?: string;
  }

  interface JWT {
    id?: string;
    username?: string;
  }
}

interface UserDb {
  id?: string;
  username?: string;
  name?: string;
  email?: string;
  pfp?: string;
}

function generateUniqueUsername(name?: string | null): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const baseName = name?.replace(/\s+/g, "").toLowerCase();
  return `${baseName}${randomNum}`;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn({ user }) {
      try {
        let dbUser: UserDb = await getUserByEmail(user.email as string);

        if (!dbUser) {
          const username = null;

          dbUser = await createUser(
            generateUniqueUsername(user.name) as string,
            user.email as string,
            user.image as string,
            user.name as string
          );
        }
        user.id = dbUser.id;
        user.name = dbUser.name;
        user.username = dbUser.username;
        user.image = dbUser.pfp;

        return true;
      } catch (error) {
        console.log("error signing in", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
};
