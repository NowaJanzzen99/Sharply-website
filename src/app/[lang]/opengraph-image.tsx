import { ImageResponse } from "next/og";

/*
  The picture a link turns into when it is shared: on LinkedIn, in WhatsApp,
  in a message. Drawn here rather than saved as a file, so the name and the
  line under it are the same words the site uses.
*/
export const alt = "Sharply: websites en webapps op maat, door Noah Janssen";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const en = lang === "en";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(60% 80% at 82% 38%, rgba(70,120,255,0.55), rgba(5,8,18,0) 70%), linear-gradient(160deg, #0b1126, #04060d)",
          color: "#eef1fb",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40, fontWeight: 700 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: "#3b6cf5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
            }}
          >
            S
          </div>
          sharply
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2, display: "flex", flexDirection: "column" }}>
            <span>{en ? "Custom websites" : "Websites op maat"}</span>
            <span>{en ? "for businesses." : "voor ondernemers."}</span>
          </div>
          <div style={{ fontSize: 30, color: "#aeb9da" }}>
            {en ? "Designed and built by Noah Janssen, Roermond. From €1,800." : "Ontwerp en bouw door Noah Janssen, Roermond. Vanaf €1.800."}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: 90,
            top: 130,
            width: 330,
            height: 330,
            borderRadius: 330,
            border: "2px solid rgba(180,200,255,0.55)",
            background:
              "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.55), rgba(120,160,255,0.25) 35%, rgba(60,90,200,0.12) 70%)",
            display: "flex",
          }}
        />
      </div>
    ),
    size,
  );
}
