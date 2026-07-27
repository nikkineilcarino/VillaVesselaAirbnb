import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const alt =
  "Villa Vessela floral photo wall at Tondol Beach with the property name and coastal-stay message";
export const contentType = "image/png";
export const size = {
  height: 630,
  width: 1200,
};

export default async function OpenGraphImage() {
  const photo = await readFile(
    join(
      process.cwd(),
      "public",
      "images",
      "villa-vessela",
      "property",
      "villa-vessela-photo-wall.jpg",
    ),
  );
  const photoUrl = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#083d54",
          color: "#ffffff",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          height={630}
          src={photoUrl}
          style={{
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 48%",
            position: "absolute",
            width: "100%",
          }}
          width={1200}
        />
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(3,31,43,0.22) 0%, rgba(3,31,43,0.08) 38%, rgba(3,31,43,0.92) 100%)",
            bottom: 0,
            display: "flex",
            left: 0,
            position: "absolute",
            right: 0,
            top: 0,
          }}
        />
        <div
          style={{
            border: "2px solid rgba(255,255,255,0.5)",
            borderRadius: "34px",
            bottom: "28px",
            display: "flex",
            left: "28px",
            position: "absolute",
            right: "28px",
            top: "28px",
          }}
        />
        <div
          style={{
            alignItems: "flex-start",
            bottom: "48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            left: "58px",
            position: "absolute",
            right: "58px",
            top: "48px",
          }}
        >
          <div
            style={{
              background: "rgba(3,47,64,0.88)",
              border: "1px solid rgba(255,255,255,0.45)",
              borderRadius: "999px",
              color: "#f4d58d",
              display: "flex",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.14em",
              padding: "14px 24px",
              textTransform: "uppercase",
            }}
          >
            Tondol Beach · Anda, Pangasinan
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textShadow: "0 3px 22px rgba(0,0,0,0.6)",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 74,
                fontWeight: 700,
                letterSpacing: "-0.035em",
                lineHeight: 1,
              }}
            >
              Villa Vessela
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.9)",
                display: "flex",
                fontSize: 29,
                lineHeight: 1.25,
                marginTop: 16,
              }}
            >
              A peaceful beachfront stay for families and groups
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
