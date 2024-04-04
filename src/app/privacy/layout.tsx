import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CQ2 — privacy policy",
  description: "CQ2 privacy policy",
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
