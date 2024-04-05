import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "CQ2";

export const contentType = "image/png";

export default async function Image() {
  const imageData = await fetch(
    new URL("../../public/meta.png", import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img width="256" height="256" src={imageData} alt="CQ2" />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
