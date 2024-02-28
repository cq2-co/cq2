import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { inter } from "../fonts";

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
      <body className={`${inter.className} overflow-hidden bg-white`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
