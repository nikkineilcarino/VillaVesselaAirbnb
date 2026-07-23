import { ImageResponse } from "next/og";

export const alt =
  "Villa Vessela social-sharing placeholder in coastal colors; official property photography is pending";
export const contentType = "image/png";
export const size = {
  height: 630,
  width: 1200,
};

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#083d54",
          color: "#ffffff",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          padding: "56px",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            border: "2px solid rgba(255,255,255,0.26)",
            borderRadius: "42px",
            display: "flex",
            flex: 1,
            overflow: "hidden",
            padding: "58px",
            position: "relative",
          }}
        >
          <div
            style={{
              background:
                "radial-gradient(circle at 20% 20%, rgba(114,184,197,0.5), transparent 38%), radial-gradient(circle at 88% 78%, rgba(184,135,53,0.44), transparent 34%)",
              display: "flex",
              inset: 0,
              position: "absolute",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "820px",
              position: "relative",
            }}
          >
            <div
              style={{
                color: "#f0c978",
                display: "flex",
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Tondol Beach · Anda, Pangasinan
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 78,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1.04,
                marginTop: 28,
              }}
            >
              Villa Vessela
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.84)",
                display: "flex",
                fontSize: 34,
                lineHeight: 1.3,
                marginTop: 24,
              }}
            >
              A peaceful beachfront stay for families and groups
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.68)",
                display: "flex",
                fontSize: 19,
                marginTop: 42,
              }}
            >
              Illustrated social placeholder · Official photography pending
            </div>
          </div>
          <div
            style={{
              alignItems: "center",
              background: "#0e5673",
              border: "2px solid rgba(255,255,255,0.32)",
              borderRadius: "999px",
              display: "flex",
              fontSize: 44,
              fontWeight: 700,
              height: "150px",
              justifyContent: "center",
              marginLeft: "auto",
              position: "relative",
              width: "150px",
            }}
          >
            VV
          </div>
        </div>
      </div>
    ),
    size,
  );
}
