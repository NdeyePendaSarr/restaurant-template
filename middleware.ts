import { NextResponse, type NextRequest } from "next/server";
import { sessionValide } from "@/lib/auth";
import { COOKIE } from "@/lib/auth";

/**
 * Protège les pages /admin (sauf la page de connexion). Les routes API admin
 * revérifient elles-mêmes la session — défense en profondeur.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const ok = await sessionValide(req.cookies.get(COOKIE)?.value);
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("suite", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
