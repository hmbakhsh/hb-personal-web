"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

// The page sweep is already the entrance for client navigations, so the
// fade-in only plays on a full page load.
export default function EntranceOnFirstLoad() {
  const pathname = usePathname();
  const firstPathname = useRef(pathname);

  useLayoutEffect(() => {
    if (pathname !== firstPathname.current) {
      document.documentElement.dataset.navigated = "";
    }
  }, [pathname]);

  return null;
}
