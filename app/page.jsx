"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCcw, Wallet, Compass, ExternalLink } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { buildJobLinks } from "../lib/jobLinks";
import { findMatches } from "../lib/jobMatching";
import { HOURS_LEVELS } from "../lib/steps";
import Questionnaire from "../components/Questionnaire";
import ResultCard from "../components/ResultCard";
import ShareResult from "../components/ShareResult";
import RankingSemanal from "../components/RankingSemanal";
import CompareLink from "../components/CompareLink";

export default function IncomeSimulator() {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState({ skills: [] });
  const [done, setDone] = useState(false);
  const [whatIf, setWhatIf] = useState(null); // null | "experience" | "format" | "hours"
  const [shareId, setShareId] = useState(null);

  const saveAnswers = async (a, id) => {
    try {
      await supabase.from("respuestas").insert({
        id,
        age: Number(a.age),
        category: a.category,
        skills: a.skills || [],
        experience: a.experience,
        format: a.format,
        computer: a.computer,
        hours: a.hours,
      });
    } catch {
      // No bloquear la experiencia del usuario si falla el guardado.
    }
  };

  const handleFinish = (finalAnswers) => {
    const id = crypto.randomUUID();
    setAnswers(finalAnswers);
    setShareId(id);
    setDone(true);
    setWhatIf(null);
    saveAnswers(finalAnswers, id);
  };

  const reset = () => {
    setAnswers({ skills: [] });
    setStarted(false);
    setDone(false);
    setWhatIf(null);
    setShareId(null);
  };

  const invertFormato = (format) => {
    if (format === "Online") return "Presencial";
    if (format === "Presencial") return "Online";
    return "Online";
  };

  const nextHoursLevel = (hours) => {
    const idx = HOURS_LEVELS.indexOf(hours);
    if (idx === -1 || idx >= HOURS_LEVELS.length - 1) return hours;
    return HOURS_LEVELS[idx + 1];
  };

  const applyWhatIf = (base, type) => {
    if (type === "experience") {
      return { ...base, experience: base.experience === "Sí" ? "No" : "Sí" };
    }
    if (type === "format") {
      return { ...base, format: invertFormato(base.format) };
    }
    if (type === "hours") {
      return { ...base, hours: nextHoursLevel(base.hours) };
    }
    return base;
  };

  const toggleWhatIf = (type) => {
    setWhatIf((prev) => (prev === type ? null : type));
  };

  const hasNextHoursLevel = HOURS_LEVELS.indexOf(answers.hours) < HOURS_LEVELS.length - 1;
  const effectiveAnswers = whatIf ? applyWhatIf(answers, whatIf) : answers;

  const recs = done ? findMatches(effectiveAnswers) : [];
  const fallbackLinks =
    done && recs.length === 0
      ? buildJobLinks({
          keyword: effectiveAnswers.category || "empleo",
          remote: effectiveAnswers.format === "Online",
        })
      : [];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-xl font-body">
        {/* Portada */}
        {!started && !done && (
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 text-amber-400">
              <Compass className="w-5 h-5" />
              <span className="text-sm tracking-wide">Orientación de ingresos</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-slate-50 leading-tight">
              ¿En qué podrías trabajar y cuánto podrías ganar?
            </h1>
            <p className="text-slate-400 max-w-md mx-auto">
              Responde 6 preguntas rápidas sobre tu situación y te mostramos opciones
              reales, pensadas para adolescentes y veinteañeros.
            </p>
            <button
              onClick={() => setStarted(true)}
              className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-medium px-6 py-3 rounded-full hover:bg-amber-300 transition-colors"
            >
              Empezar <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-sm text-slate-500">
              ¿Quieres ver todos los trabajos disponibles?{" "}
              <Link href="/explorar" className="text-amber-400 hover:text-amber-300 underline">
                Explóralos aquí
              </Link>
              .
            </p>
            <RankingSemanal />
          </div>
        )}

        {/* Preguntas */}
        {started && !done && (
          <Questionnaire onExit={() => setStarted(false)} onFinish={handleFinish} />
        )}

        {/* Resultados */}
        {done && (
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <h2 className="font-display text-3xl text-slate-50">Tus opciones</h2>
              <p className="text-slate-400 text-sm">
                Según lo que nos has contado, esto es lo que más encaja contigo.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => toggleWhatIf("experience")}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  whatIf === "experience"
                    ? "border-amber-400 bg-amber-400/10 text-amber-300"
                    : "border-slate-700 text-slate-300 hover:border-slate-600"
                }`}
              >
                {answers.experience === "Sí"
                  ? "¿Y si NO tuvieras experiencia?"
                  : "¿Y si tuvieras experiencia?"}
              </button>
              <button
                onClick={() => toggleWhatIf("format")}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  whatIf === "format"
                    ? "border-amber-400 bg-amber-400/10 text-amber-300"
                    : "border-slate-700 text-slate-300 hover:border-slate-600"
                }`}
              >
                ¿Y si fuera {invertFormato(answers.format).toLowerCase()}?
              </button>
              <button
                onClick={() => toggleWhatIf("hours")}
                disabled={!hasNextHoursLevel}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-700 ${
                  whatIf === "hours"
                    ? "border-amber-400 bg-amber-400/10 text-amber-300"
                    : "border-slate-700 text-slate-300 hover:border-slate-600"
                }`}
              >
                ¿Y si tuvieras más horas disponibles?
              </button>
            </div>

            {whatIf && (
              <p className="text-center text-xs text-slate-500">
                Estás viendo una simulación, no tu resultado guardado.{" "}
                <button
                  onClick={() => setWhatIf(null)}
                  className="text-amber-400 hover:text-amber-300 underline"
                >
                  Volver a tu resultado real
                </button>
              </p>
            )}

            {recs.length === 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-center">
                <p className="text-slate-400 text-sm">
                  No hemos encontrado opciones exactas con estos filtros todavía. Prueba a
                  ampliar el tiempo disponible o el formato de trabajo, o explora directamente
                  ofertas de "{answers.category}" en estos portales:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {fallbackLinks.map((link) => (
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
            )}

            <AnimatePresence mode="popLayout">
              {recs.map((r, i) => {
                const jobLinks = buildJobLinks({
                  keyword: r.titulo,
                  remote: r.formatos.includes("online"),
                });
                return (
                  <ResultCard key={r.id} index={i}>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-display text-xl text-slate-50">{r.titulo}</h3>
                        <span className="inline-flex items-center gap-1 text-amber-400 text-sm whitespace-nowrap">
                          <Wallet className="w-4 h-4" /> {r.ingresoEstimadoMin}–
                          {r.ingresoEstimadoMax} €
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">{r.desc}</p>
                      <div className="pt-2 border-t border-slate-800 text-sm text-slate-300">
                        <span className="text-slate-500">Primer paso: </span>
                        {r.next}
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
                      <ShareResult
                        titulo={r.titulo}
                        min={r.ingresoEstimadoMin}
                        max={r.ingresoEstimadoMax}
                      />
                    </div>
                  </ResultCard>
                );
              })}
            </AnimatePresence>

            <CompareLink shareId={shareId} />

            <button
              onClick={reset}
              className="w-full inline-flex items-center justify-center gap-2 text-slate-400 hover:text-slate-200 text-sm pt-2"
            >
              <RotateCcw className="w-4 h-4" /> Empezar de nuevo
            </button>
            <p className="text-center text-sm text-slate-500">
              ¿Quieres ver todos los trabajos disponibles?{" "}
              <Link href="/explorar" className="text-amber-400 hover:text-amber-300 underline">
                Explóralos aquí
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
