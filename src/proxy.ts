import { NextResponse, type NextRequest } from "next/server";

// Serve each side project's page at the root of its own subdomain,
// e.g. rootie.hbak.co → /rootie. Locally: rootie.localhost:3000.
const subdomains = ["rootie", "notch"];

export function proxy(request: NextRequest) {
  const sub = request.headers.get("host")?.split(".")[0];
  if (!sub || !subdomains.includes(sub)) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${sub}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: "/",
};
