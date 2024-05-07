import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import lightFavicon from "../../public/logos/cq2-rect-black-transparent.svg";
import darkFavicon from "../../public/logos/cq2-rect-white-transparent.svg";
import { inter } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "CQ2 — tool for complex discussions",
  description:
    "CQ2 is the free and open source tool for complex discussions. No more mess of unorganised comments. Forget quote hell. Focus on what matters. Conclude threads. Never lose context of where you are.",
  metadataBase: new URL("https://cq2.co"),
  openGraph: {
    title: "CQ2 — tool for complex discussions",
    description:
      "CQ2 is the free and open source tool for complex discussions. No more mess of unorganised comments. Forget quote hell. Focus on what matters. Conclude threads. Never lose context of where you are.",
    url: "https://cq2.co",
    siteName: "CQ2",
    locale: "en_US",
    type: "website",
    images: "https://cq2.co/meta.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "CQ2 — tool for complex discussions",
    description:
      "CQ2 is the free and open source tool for complex discussions. No more mess of unorganised comments. Forget quote hell. Focus on what matters. Conclude threads. Never lose context of where you are.",
    site: "@cq2_co",
    images: "https://cq2.co/meta.png",
  },
  icons: {
    icon: [
      {
        rel: "icon",
        media: "(prefers-color-scheme: light)",
        type: "image/svg",
        url: lightFavicon.src,
      },
      {
        rel: "icon",
        media: "(prefers-color-scheme: dark)",
        type: "image/png",
        url: darkFavicon.src,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden bg-[#FFFFFF]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <main className="bg-[#FFFFFF]">
            <div>{children}</div>
            <div className="flex h-screen flex-col items-center justify-center bg-neutral-50 md:hidden">
              <p className="w-fit bg-[#FF5F1F]/10 p-1 text-xs text-[#FF5F1F]">
                CQ2 is not optimized for mobile use, yet.
              </p>
              <p className="mt-1 w-fit bg-[#FF5F1F]/10 p-1 text-xs text-[#FF5F1F]">
                Please try on a desktop or laptop.
              </p>
              <Link
                href="/"
                className="mt-8 flex w-fit flex-row items-center justify-center bg-neutral-200 p-1 text-xs text-neutral-600"
              >
                <span>Go back to homepage</span>
                <ArrowRight className="ml-1 h-3 w-3" strokeWidth={2} />
              </Link>
            </div>
            <Toaster
              closeButton
              richColors
              duration={10000}
              className="hidden md:flex"
              toastOptions={{
                style: {
                  borderRadius: 0,
                },
              }}
            />
          </main>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-0KJ0KXXT31" />
    </html>
  );
}
