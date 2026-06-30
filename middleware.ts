import { auth } from "@/lib/auth"; // wherever your NextAuth() config lives
import { NextResponse } from "next/server";

const protectedPaths = ["/dashboard"];
const authPaths = ["/login", "/register"];

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const loggedIn = !!req.auth;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuth = authPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !loggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuth && loggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};