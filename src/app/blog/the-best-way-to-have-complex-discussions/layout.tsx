import type { Metadata } from "next";
import lightFavicon from "../../../../public/logos/cq2-rect-black-transparent.svg";
import darkFavicon from "../../../../public/logos/cq2-rect-white-transparent.svg";

export const metadata: Metadata = {
  title: "The best way to have complex discussions — CQ2",
  description:
    "We love complex, deep discussions. We've seen or been part of many discussions — strategic discussions at work, discussions on AI alignment, on technical design documents, etc. For us, the most frustrating issues with complex discussions are (1) impulsive responses and (2) lack of structure.",
  metadataBase: new URL("https://cq2.co"),
  openGraph: {
    title: "The best way to have complex discussions — CQ2",
    description:
      "We love complex, deep discussions. We've seen or been part of many discussions — strategic discussions at work, discussions on AI alignment, on technical design documents, etc. For us, the most frustrating issues with complex discussions are (1) impulsive responses and (2) lack of structure.",
    url: "https://cq2.co",
    siteName: "CQ2",
    locale: "en_US",
    type: "website",
    images: "https://cq2.co/blog-post-images/meta.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "The best way to have complex discussions — CQ2",
    description:
      "We love complex, deep discussions. We've seen or been part of many discussions — strategic discussions at work, discussions on AI alignment, on technical design documents, etc. For us, the most frustrating issues with complex discussions are (1) impulsive responses and (2) lack of structure.",
    site: "@cq2_co",
    images: "https://cq2.co/blog-post-images/meta.png",
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
      <div>{children}</div>
    </section>
  );
}
