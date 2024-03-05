import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { inter } from "../fonts";
import LeftNav from "@/components/left-nav";
import TopNav from "@/components/top-nav";

export const metadata: Metadata = {
  title: "Demo — CQ2",
  description:
    "Try the demo of CQ2, a tool for thoughtful and coherent discussions.",
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
            <LeftNav />
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
