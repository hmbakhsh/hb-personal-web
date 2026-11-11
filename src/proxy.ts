import { NextResponse, type NextRequest } from "next/server";

// Old subdomains send people to the project's page on the main site, so every
// page shares an origin and can use page transitions. Locally: rootie.localhost:3000.
const subdomains = ["rootie", "notch"];

export function proxy(request: NextRequest) {
  const [sub, ...rest] = request.headers.get("host")?.split(".") ?? [];
  if (!sub || !subdomains.includes(sub)) return;

  const url = request.nextUrl.clone();
  url.host = rest.join(".");
  url.pathname = `/projects/${sub}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/",
};
