import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "¿En qué puedo trabajar y cuánto puedo ganar?",
  description: "Simulador de ingresos para adolescentes y veinteañeros.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
