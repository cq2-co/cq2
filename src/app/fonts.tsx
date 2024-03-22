import localFont from "next/font/local";

export const inter = localFont({
  src: [
    {
      path: "../../public/fonts/inter/InterVariable.woff2",
      style: "normal",
    },
    {
      path: "../../public/fonts/inter/InterVariable-Italic.woff2",
      style: "italic",
    },
  ],
});

export const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/satoshi/Satoshi-Variable.woff2",
      style: "normal",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-VariableItalic.woff2",
      style: "italic",
    },
  ],
});
