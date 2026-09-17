import Link from "next/link";
import { ArrowRight, Wallet, Compass } from "lucide-react";

export function generateMetadata({ searchParams }) {
  const titulo = searchParams.titulo || "Tu resultado";
  const min = searchParams.min;
  const max = searchParams.max;

  const ogParams = new URLSearchParams({ titulo });
  if (min) ogParams.set("min", min);
  if (max) ogParams.set("max", max);
  const imageUrl = `/api/og?${ogParams.toString()}`;

  const description =
    min && max
      ? `Ingreso estimado: ${min}–${max} €. Descubre tu propia opción en el Simulador de Ingresos.`
      : "Descubre en qué podrías trabajar y cuánto podrías ganar.";

  return {
    title: `${titulo} · Simulador de Ingresos`,
    description,
    openGraph: {
      title: titulo,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description,
      images: [imageUrl],
    },
  };
}

export default function ResultadoCompartido({ searchParams }) {
  const titulo = searchParams.titulo || "Tu resultado";
  const min = searchParams.min;
  const max = searchParams.max;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-xl font-body text-center space-y-6">
        <div className="inline-flex items-center gap-2 text-amber-400">
          <Compass className="w-5 h-5" />
          <span className="text-sm tracking-wide">Simulador de Ingresos</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-slate-50 leading-tight">
          {titulo}
        </h1>
        {min && max && (
          <p className="inline-flex items-center gap-1 text-amber-400 text-lg">
            <Wallet className="w-5 h-5" /> {min}–{max} €
          </p>
        )}
        <p className="text-slate-400 max-w-md mx-auto">
          Esto es lo que le salió a quien te compartió este resultado. Responde el
          cuestionario y descubre tu propia opción.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-medium px-6 py-3 rounded-full hover:bg-amber-300 transition-colors"
        >
          Hacer el test <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
