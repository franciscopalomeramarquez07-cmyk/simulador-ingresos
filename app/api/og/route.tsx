import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const titulo = (searchParams.get("titulo") || "Tu resultado").slice(0, 80);
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const earn = min && max ? `${min}–${max} €` : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#020617",
          backgroundImage:
            "radial-gradient(circle at 88% 15%, rgba(251,191,36,0.16), rgba(251,191,36,0) 45%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#fbbf24",
            fontSize: "26px",
            fontWeight: 600,
            letterSpacing: "1px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#fbbf24",
              display: "flex",
            }}
          />
          SIMULADOR DE INGRESOS
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "66px",
            fontWeight: 600,
            color: "#f8fafc",
            lineHeight: 1.15,
            maxWidth: "980px",
          }}
        >
          {titulo}
        </div>

        {earn && (
          <div
            style={{
              display: "flex",
              marginTop: "36px",
              fontSize: "38px",
              color: "#fbbf24",
              fontWeight: 600,
            }}
          >
            Ingreso estimado: {earn}
          </div>
        )}

        <div
          style={{
            display: "flex",
            marginTop: "56px",
            fontSize: "24px",
            color: "#94a3b8",
          }}
        >
          Descubre en qué podrías trabajar y cuánto podrías ganar.
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
