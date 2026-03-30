import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

const publicPaths = ["/", "/about", "/contact", "/login", "/register", "/api/auth", "/api/register"];

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isPublic = publicPaths.some((path) => pathname.startsWith(path));

      if (!auth && !isPublic) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (auth && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
