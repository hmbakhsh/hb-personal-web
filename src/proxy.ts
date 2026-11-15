import { NextResponse, type NextRequest } from "next/server";

// Project subdomains send people to the project's page on the main site, so
// every page shares an origin and can use page transitions. Locally:
// rootie.localhost:3000. notch is Island's old name.
const subdomains: Record<string, string> = { rootie: "rootie", island: "island", notch: "island" };

export function proxy(request: NextRequest) {
  const [sub, ...rest] = request.headers.get("host")?.split(".") ?? [];
  const project = sub && Object.hasOwn(subdomains, sub) ? subdomains[sub] : undefined;
  if (!project) return;

  const url = request.nextUrl.clone();
  url.host = rest.join(".");
  url.pathname = `/projects/${project}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/",
};
