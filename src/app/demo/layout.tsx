import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CQ2 — demo",
  description: "CQ2 demo",
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
      <div>{children}</div>
    </section>
  );
}
