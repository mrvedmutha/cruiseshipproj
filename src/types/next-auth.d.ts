import "next-auth";
import { DefaultSession } from "next-auth";
import "next";

declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    fullName?: string;
    email?: string;
    role?: string;
  }
  interface Session {
    user: {
      _id?: string;
      username?: string;
      fullName?: string;
      email?: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    username?: string;
    fullName?: string;
    email?: string;
    role?: string;
  }
}

declare module "next/server" {
  interface NextRequest {
    session: {
      user: any; // Adjust the type of 'user' as needed
    };
  }
}
