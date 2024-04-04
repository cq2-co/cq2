import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { inter } from "./fonts";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CQ2 — tool for complex discussions",
  description:
    "CQ2 is the free and open source tool for complex discussions. Hyper-focus on one thing at a time. No more losing context. No more copy-pasting quotes.",
  metadataBase: new URL("https://cq2.co"),
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
                CQ2 is not optimized for mobile use.
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
              duration={15000}
              className="hidden md:flex"
            />
          </main>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-0KJ0KXXT31" />
    </html>
  );
}
