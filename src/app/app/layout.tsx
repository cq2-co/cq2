import type { Metadata } from "next";
import TopNav from "@/components/top-nav";

export const metadata: Metadata = {
  title: "CQ2 — app",
  description: "CQ2 app",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <TopNav />
      <div className="hidden md:flex">{children}</div>
    </section>
  );
}
