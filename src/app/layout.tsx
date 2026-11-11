import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import EntranceOnFirstLoad from "@/components/EntranceOnFirstLoad";
import { PageTransitionProvider } from "@/components/PageTransition";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "haroon bakhsh",
  description:
    "Member of Technical Staff at 36 Labs, researching creativity in large language models.",
  icons: {
    icon: "/hb-icon.png",
    apple: "/hb-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        <noscript>
          <style>{`.intro-cover { display: none; }`}</style>
        </noscript>
      </head>
      <body className="bg-[var(--bg)] text-[var(--ink)] font-sans antialiased">
        <PageTransitionProvider>
          <EntranceOnFirstLoad />
          {children}
        </PageTransitionProvider>
      </body>
    </html>
  );
}
