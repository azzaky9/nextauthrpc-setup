import { User, Session, DefaultUser, DefaultSession } from "next-auth";
import { admin_role } from "@prisma/client";
import JWT from "next-auth/jwt";

declare module "next-auth" {
  export interface User extends DefaultUser {
    role: admin_role;
  }

  export interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "admin" | "user";
  }
}
