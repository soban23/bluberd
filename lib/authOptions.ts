// lib/authOptions.ts
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"
import { getUserByEmail, createUser } from '@/lib/db/users'
import imageUrlToBuffer from '@/helper/buffer'

declare module 'next-auth' {
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


export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

        }),

    ],
    pages: {
        signIn: "/signin",
    },
    callbacks: {
        async signIn({ user }) {

            try {
                let dbUser = await getUserByEmail(user.email as string);



                if (!dbUser) {
                    const username = null;
                    //convert string tp bytea
                    //const imageBuffer = await imageUrlToBuffer(user.image!);

                    dbUser = await createUser(username as any, user.email as string, user.image as string , user.name as string);

                }
                // console.log(user.sub);
                console.log(dbUser);
                user.id = dbUser[0].id;
                user.name = dbUser[0].name;
                user.username = dbUser[0].username;
                user.image = dbUser[0].pfp;

                //convert bytea to string
                // const base64 = dbUser.pfp.toString('base64');
                // const dataUrl = `data:image/jpeg;base64,${base64}`;

                // user.image = dataUrl;

                return true;

            } catch (error) {
                console.log('error signing in', error);
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

    }
}
