import type { NextAuthConfig } from "next-auth";

function isPublicAdminPath(pathname: string) {
  if (pathname === "/admin/login") return true;
  if (pathname === "/admin/forgot-password") return true;
  if (pathname.startsWith("/admin/reset-password/")) return true;
  return false;
}

export const authConfig = {
  providers: [],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const pathname = request.nextUrl.pathname;
      const isAdminRoute = pathname.startsWith("/admin");
      const isPublicPath = isPublicAdminPath(pathname);

      if (isAdminRoute && !isPublicPath) {
        return isLoggedIn;
      }

      if ((pathname === "/admin/login" || pathname === "/admin/forgot-password") && isLoggedIn) {
        return Response.redirect(new URL("/admin", request.nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        const remember = (user as { remember?: boolean }).remember;
        const maxAge = remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
        token.exp = Math.floor(Date.now() / 1000) + maxAge;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
