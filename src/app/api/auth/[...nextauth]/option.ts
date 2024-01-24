import { AuthOptions, Session } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { JWT } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";
import { type CredentialReqBody } from "@/types/types";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/app/_lib/db";

const options: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email or Username",
          placeholder: "Type your email here.",
          type: "text"
        },
        password: {
          label: "Password",
          placeholder: "Type your password here.",
          type: "password"
        }
      },
      authorize: async (_, req) => {
        try {
          const prismaConnection = new PrismaClient();
          const body = req.body as CredentialReqBody;

          if (!body.email || !body.password) {
            throw new Error("email or username and password must be required");
          }

          const foundUser = await prismaConnection.user.findFirst({
            where: {
              OR: [
                {
                  email: body.email
                },
                {
                  username: body.password
                }
              ]
            },
            select: {
              username: true,
              email: true,
              display_name: true,
              role: true,
              password: true
            }
          });

          if (foundUser) {
            const match = await bcrypt.compare(
              body.password,
              foundUser.password
            );

            if (match) {
              return {
                id: "",
                role: foundUser.role,
                email: foundUser.email,
                name: foundUser.display_name
              };
            }

            throw new Error("Password not authorized, Invalid Password");
          }
        } catch (error) {
          if (error instanceof Error) {
            console.log("err fn", error.message);
          }
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: "/auth/credential-signin"
  },
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ user }) {
      if (user) {
        return true;
      } else {
        return "/auth/credential-signin";
      }
    },
    async jwt({ token, user }): Promise<JWT> {
      if (user) token.role = user.role;

      return token;
    },
    async session({ session, token }): Promise<Session> {
      if (token) session.user.role = token.role;

      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

export { options };
