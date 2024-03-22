import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { inter } from "./fonts";
import TopNav from "@/components/top-nav";

export const metadata: Metadata = {
  title: "CQ2 — tool for complex discussions",
  description: "CQ2 is the work communication tool for writing-first teams.",
  metadataBase: new URL("https://CQ2.co"),
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
              <p>CQ2 doesn&apos;t work on mobile, yet.</p>
              <p>Please try on a bigger device.</p>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
