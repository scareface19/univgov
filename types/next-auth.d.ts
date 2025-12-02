import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    digitalId: string;
    permissions: string[];
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      digitalId: string;
      permissions: string[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    digitalId: string;
    permissions: string[];
  }
}
