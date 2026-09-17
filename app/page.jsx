"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, RotateCcw, Clock, Wallet, Compass, ExternalLink } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { buildJobLinks } from "../lib/jobLinks";
import { findMatches } from "../lib/jobMatching";
import ResultCard from "../components/ResultCard";
import ShareResult from "../components/ShareResult";
import RankingSemanal from "../components/RankingSemanal";

const HOURS_LEVELS = ["Menos de 5h", "5–10h", "10–20h", "Más de 20h"];

const STEPS = [
  {
    key: "age",
    title: "¿Cuántos años tienes?",
    type: "number",
  },
  {
    key: "category",
    title: "¿Qué tipo de trabajo te llama más?",
    type: "single",
    options: ["Tecnológico", "Creativo", "Social-Comunicación", "Manual-práctico", "Enseñar"],
  },
  {
    key: "skills",
    title: "¿Tienes alguna habilidad previa?",
    type: "multi",
    options: ["Programación", "Idiomas", "Diseño", "Redes sociales", "Ninguna todavía"],
  },
  {
    key: "experience",
    title: "¿Tienes experiencia trabajando?",
    type: "single",
    options: ["Sí", "No"],
  },
  {
    key: "format",
    title: "¿Cómo prefieres trabajar?",
    type: "single",
    options: ["Online", "Presencial", "Me da igual"],
  },
  {
    key: "computer",
    title: "¿Tienes acceso a un ordenador propio?",
    type: "single",
    options: ["Sí", "No"],
  },
  {
    key: "hours",
    title: "¿Cuánto tiempo tienes disponible a la semana?",
    type: "single",
    options: HOURS_LEVELS,
  },
];

export default function IncomeSimulator() {
  const [step, setStep] = useState(-1); // -1 = portada
  const [answers, setAnswers] = useState({ skills: [] });
  const [done, setDone] = useState(false);
  const [dir, setDir] = useState(1); // 1 = avanzar, -1 = retroceder
  const [whatIf, setWhatIf] = useState(null); // null | "experience" | "format" | "hours"

  const current = STEPS[step];

  const canAdvance = () => {
    if (!current) return false;
    if (current.type === "number") return answers.age && Number(answers.age) > 0;
    if (current.type === "multi") return (answers[current.key] || []).length > 0;
    return !!answers[current.key];
  };

  const saveAnswers = async (a) => {
    try {
      await supabase.from("respuestas").insert({
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

  const next = () => {
    setDir(1);
    if (step === STEPS.length - 1) {
      setDone(true);
      saveAnswers(answers);
    } else {
      setStep(step + 1);
    }
  };
  const back = () => {
    setDir(-1);
    setStep(Math.max(-1, step - 1));
  };

  const toggleMulti = (key, value) => {
    setAnswers((prev) => {
      const list = prev[key] || [];
      const exists = list.includes(value);
      const nextList = exists ? list.filter((v) => v !== value) : [...list, value];
      return { ...prev, [key]: nextList };
    });
  };

  const reset = () => {
    setAnswers({ skills: [] });
    setStep(-1);
    setDone(false);
    setWhatIf(null);
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
        {step === -1 && !done && (
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
              onClick={() => setStep(0)}
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
        {step >= 0 && !done && (
          <div
            key={step}
            className={`bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 ${
              dir === 1 ? "animate-slide-right" : "animate-slide-left"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Pregunta {step + 1} de {STEPS.length}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {Math.round(((step + 1) / STEPS.length) * 100)}%
                </span>
              </div>
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                      i <= step ? "bg-amber-400" : "bg-slate-800"
                    }`}
                  />
                ))}
              </div>
            </div>

            <h2 className="font-display text-2xl text-slate-50">{current.title}</h2>

            {current.type === "number" && (
              <input
                type="number"
                min="10"
                max="99"
                value={answers.age || ""}
                onChange={(e) => setAnswers({ ...answers, age: e.target.value })}
                placeholder="Ej: 16"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-50 placeholder-slate-500 outline-none focus:border-amber-400"
              />
            )}

            {current.type === "single" && (
              <div className="grid gap-2">
                {current.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAnswers({ ...answers, [current.key]: opt })}
                    className={`text-left px-4 py-3 rounded-xl border transition-colors ${
                      answers[current.key] === opt
                        ? "border-amber-400 bg-amber-400/10 text-amber-300"
                        : "border-slate-700 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {current.type === "multi" && (
              <div className="grid gap-2">
                {current.options.map((opt) => {
                  const checked = (answers[current.key] || []).includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleMulti(current.key, opt)}
                      className={`text-left px-4 py-3 rounded-xl border transition-colors ${
                        checked
                          ? "border-amber-400 bg-amber-400/10 text-amber-300"
                          : "border-slate-700 text-slate-300 hover:border-slate-600"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex justify-between pt-2">
              <button
                onClick={back}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Atrás
              </button>
              <button
                onClick={next}
                disabled={!canAdvance()}
                className="inline-flex items-center gap-2 bg-amber-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-medium px-5 py-2.5 rounded-full hover:bg-amber-300 transition-colors"
              >
                {step === STEPS.length - 1 ? "Ver resultados" : "Siguiente"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
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
