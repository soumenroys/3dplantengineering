// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // If cookie already set, continue
  const existing = req.cookies.get("country")?.value;
  if (existing) return NextResponse.next();

  // Very light heuristic from Accept-Language → default to IN if it looks Indian, else US
  const al = req.headers.get("accept-language") || "";
  const isIN = /(?:^|,)\s*([a-z]{2,3}(?:-[A-Z]{2})?)/i.test(al) && /-IN\b/i.test(al);
  const cc = isIN ? "IN" : "US";

  const res = NextResponse.next();
  res.cookies.set("country", cc, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
  return res;
}

// (optional) Limit to site routes only
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
