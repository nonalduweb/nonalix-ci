"use client";

import { usePathname } from "next/navigation";

export function CanonicalURL() {
  const pathname = usePathname();
  const siteUrl = "https://nonalix-ci.com";
  // Nettoyer l'URL pour éviter les slashs de fin doubles
  const canonicalUrl = `${siteUrl}${pathname === "/" ? "" : pathname}`;

  return <link rel="canonical" href={canonicalUrl} />;
}
