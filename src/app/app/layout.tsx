import AppTopNav from "@/components/app-top-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import Link from "next/link";
import favicon from "../../../public/logos/cq2-favicon-neutral.svg";
import { inter } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "CQ2 — app",
  description: "CQ2 app",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: [
      {
        rel: "icon",
        media: "(prefers-color-scheme: light)",
        type: "image/svg",
        url: favicon.src,
      },
      {
        rel: "icon",
        media: "(prefers-color-scheme: dark)",
        type: "image/png",
        url: favicon.src,
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
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} overflow-hidden bg-[#FFFFFF]`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <main className="bg-[#FFFFFF]">
              <div>
                <section>
                  <AppTopNav />
                  <div className="hidden md:flex">{children}</div>
                </section>
              </div>
              <div className="flex h-screen flex-col items-center justify-center bg-neutral-50 md:hidden">
                <p className="w-fit rounded-lg bg-CQ2Orange-600/10 p-1 px-2 text-xs text-CQ2Orange-600">
                  CQ2 is not optimized for mobile use, yet.
                </p>
                <p className="mt-1 w-fit rounded-lg bg-CQ2Orange-600/10 p-1 px-2 text-xs text-CQ2Orange-600">
                  Please try on a desktop or laptop.
                </p>
                <Link
                  href="/"
                  className="mt-8 flex w-fit flex-row items-center justify-center rounded-lg bg-neutral-200 p-1 px-2 text-xs text-neutral-600"
                >
                  <span>Go back to homepage</span>
                  <ArrowRight className="ml-1 h-3 w-3" strokeWidth={2} />
                </Link>
              </div>
              <Toaster
                closeButton
                richColors
                duration={5000}
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
      </html>
    </ViewTransitions>
  );
}
