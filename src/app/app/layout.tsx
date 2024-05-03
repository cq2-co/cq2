import TopNav from "@/components/top-nav";
import type { Metadata } from "next";
import lightFavicon from "../../../public/logos/cq2-rect-black-transparent.svg";
import darkFavicon from "../../../public/logos/cq2-rect-white-transparent.svg";

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
        url: lightFavicon.src,
      },
      {
        rel: "icon",
        media: "(prefers-color-scheme: dark)",
        type: "image/png",
        url: darkFavicon.src,
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
      <TopNav />
      <div className="hidden md:flex">{children}</div>
    </section>
  );
}
