import type { Metadata } from "next";
import favicon from "../../../public/logos/cq2-social.svg";

export const metadata: Metadata = {
  title: "CQ2 — demo",
  description: "CQ2 demo",
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
    <section>
      <div>{children}</div>
    </section>
  );
}
