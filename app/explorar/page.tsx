"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Wallet, Compass } from "lucide-react";
import { JOBS } from "../../data/jobs";
import { buildJobLinks } from "../../lib/jobLinks";
import ResultCard from "../../components/ResultCard";

const CATEGORIAS = Array.from(new Set(JOBS.flatMap((job) => job.categorias))).sort();

const FORMATOS: { label: string; value: "todos" | "online" | "presencial" }[] = [
  { label: "Todos", value: "todos" },
  { label: "Online", value: "online" },
  { label: "Presencial", value: "presencial" },
];

const RANGOS_INGRESO: { label: string; value: string }[] = [
  { label: "Cualquier ingreso", value: "todos" },
  { label: "Hasta 20 €", value: "hasta-20" },
  { label: "20–100 €", value: "20-100" },
  { label: "Más de 100 €", value: "mas-100" },
];

function pasaRangoIngreso(job: (typeof JOBS)[number], rango: string) {
  if (rango === "todos") return true;
  if (rango === "hasta-20") return job.ingresoEstimadoMax <= 20;
  if (rango === "20-100") return job.ingresoEstimadoMax > 20 && job.ingresoEstimadoMax <= 100;
  if (rango === "mas-100") return job.ingresoEstimadoMax > 100;
  return true;
}

export default function ExplorarPage() {
  const [categoria, setCategoria] = useState("todas");
  const [formato, setFormato] = useState<"todos" | "online" | "presencial">("todos");
  const [rangoIngreso, setRangoIngreso] = useState("todos");

  const jobsFiltrados = useMemo(() => {
    return JOBS.filter((job) => {
      if (categoria !== "todas" && !job.categorias.includes(categoria)) return false;
      if (formato !== "todos" && !job.formatos.includes(formato)) return false;
      if (!pasaRangoIngreso(job, rangoIngreso)) return false;
      return true;
    });
  }, [categoria, formato, rangoIngreso]);

  return (
    <div className="min-h-screen w-full bg-slate-950 p-6">
      <div className="w-full max-w-3xl mx-auto font-body space-y-6 py-6">
        <div className="space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al simulador
          </Link>
          <div className="inline-flex items-center gap-2 text-amber-400">
            <Compass className="w-5 h-5" />
            <span className="text-sm tracking-wide">Simulador de Ingresos</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-slate-50 leading-tight">
            Explora todos los trabajos
          </h1>
          <p className="text-slate-400 max-w-md">
            Sin cuestionario: navega los {JOBS.length} trabajos que conocemos y filtra por
            categoría, formato o ingreso estimado.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Categoría
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoria("todas")}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                  categoria === "todas"
                    ? "border-amber-400 bg-amber-400/10 text-amber-300"
                    : "border-slate-700 text-slate-300 hover:border-slate-600"
                }`}
              >
                Todas
              </button>
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoria(cat)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                    categoria === cat
                      ? "border-amber-400 bg-amber-400/10 text-amber-300"
                      : "border-slate-700 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Formato
            </span>
            <div className="flex flex-wrap gap-2">
              {FORMATOS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFormato(f.value)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                    formato === f.value
                      ? "border-amber-400 bg-amber-400/10 text-amber-300"
                      : "border-slate-700 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Ingreso estimado
            </span>
            <div className="flex flex-wrap gap-2">
              {RANGOS_INGRESO.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRangoIngreso(r.value)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                    rangoIngreso === r.value
                      ? "border-amber-400 bg-amber-400/10 text-amber-300"
                      : "border-slate-700 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-slate-500 text-sm">
          {jobsFiltrados.length} trabajo{jobsFiltrados.length === 1 ? "" : "s"} encontrado
          {jobsFiltrados.length === 1 ? "" : "s"}
        </p>

        <div className="space-y-5">
          {jobsFiltrados.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
              No hay trabajos con esos filtros. Prueba a quitar alguno.
            </div>
          )}

          {jobsFiltrados.map((job, i) => {
            const jobLinks = buildJobLinks({
              keyword: job.titulo,
              remote: job.formatos.includes("online"),
            });
            return (
              <ResultCard key={job.id} index={i}>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-xl text-slate-50">{job.titulo}</h3>
                    <span className="inline-flex items-center gap-1 text-amber-400 text-sm whitespace-nowrap">
                      <Wallet className="w-4 h-4" /> {job.ingresoEstimadoMin}–
                      {job.ingresoEstimadoMax} €
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">{job.desc}</p>
                  <div className="pt-2 border-t border-slate-800 text-sm text-slate-300">
                    <span className="text-slate-500">Primer paso: </span>
                    {job.next}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {jobLinks.map((link) => (
                      <a
                        key={link.portal}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-slate-300 border border-slate-700 rounded-full px-3 py-1 hover:border-amber-400 hover:text-amber-300 transition-colors"
                      >
                        {link.portal} <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              </ResultCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
