import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { inter } from "./fonts";
import TopNav from "@/components/top-nav";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@next/third-parties/google";

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
            <TopNav />
            <div>{children}</div>
            <div className="flex h-screen flex-col items-center justify-center bg-neutral-50 md:hidden">
              <p>CQ2 is not optimized for mobile use.</p>
              <p>Please try on a desktop or laptop.</p>
            </div>
            <Toaster closeButton richColors duration={15000} />
          </main>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-0KJ0KXXT31" />
    </html>
  );
}
