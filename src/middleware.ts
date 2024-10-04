import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request }).catch((error) => {
    console.error("Error fetching token in middleware:", error);
  });
  const url = request.nextUrl;
  if (!token && url.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && url.pathname === "/login") {
    switch (token.role) {
      case "ADMIN":
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      case "MANAGER":
        return NextResponse.redirect(
          new URL("/manager/dashboard", request.url)
        );
      case "CHEF":
        return NextResponse.redirect(new URL("/chef/dashboard", request.url));
      case "SUPERVISOR":
        return NextResponse.redirect(
          new URL("/supervisor/dashboard", request.url)
        );
      case "GUEST":
        return NextResponse.redirect(new URL("/guest/dashboard", request.url));
      default:
        break;
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/verify/:path*",
    "/guest/:path*",
    "/manager/:path*",
    "/chef/:path*",
    "/supervisor/:path*",
  ],
};
