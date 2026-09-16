"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, RotateCcw, Clock, Wallet, Compass } from "lucide-react";

// ---------- Banco de opciones (motor de reglas) ----------
const OPTIONS = [
  {
    id: "clases",
    name: "Clases particulares",
    category: ["Enseñar"],
    skills: ["Ninguna todavía", "Idiomas", "Programación", "Diseño"],
    minHoursIdx: 0,
    format: ["Presencial", "Online", "Me da igual"],
    minAge: 14,
    earn: "10–20 €/hora",
    desc: "Enseña lo que ya dominas a quien va un paso por detrás de ti.",
    next: "Ofrécete a compañeros o vecinos. Después de la primera clase, pide que te recomienden.",
  },
  {
    id: "automatizaciones",
    name: "Automatizaciones con IA",
    category: ["Tecnológico"],
    skills: ["Ninguna todavía", "Programación"],
    minHoursIdx: 1,
    format: ["Online"],
    minAge: 15,
    requiresComputer: true,
    earn: "100–300 € por proyecto",
    desc: "Construye pequeños scripts que ahorren tiempo a negocios locales.",
    next: "Identifica una tarea repetitiva de un negocio cercano y ofrécete a automatizarla gratis la primera vez.",
  },
  {
    id: "freelance-dev",
    name: "Freelance de programación",
    category: ["Tecnológico"],
    skills: ["Programación"],
    minHoursIdx: 1,
    format: ["Online"],
    minAge: 15,
    requiresComputer: true,
    earn: "15–30 €/hora",
    desc: "Pequeñas webs, arreglos o mejoras de código para clientes reales.",
    next: "Crea un portafolio con 2-3 proyectos propios y publícate en Workana o Fiverr.",
  },
  {
    id: "redes",
    name: "Gestión de redes sociales",
    category: ["Creativo", "Social-Comunicación"],
    skills: ["Redes sociales", "Ninguna todavía", "Diseño"],
    minHoursIdx: 0,
    format: ["Online"],
    minAge: 15,
    earn: "80–200 €/mes por cliente",
    desc: "Lleva Instagram o TikTok a pequeños negocios que no tienen tiempo.",
    next: "Elige un negocio local, propón 3 ideas de contenido gratis y muestra resultados.",
  },
  {
    id: "productos-digitales",
    name: "Productos digitales",
    category: ["Creativo", "Tecnológico"],
    skills: ["Diseño", "Programación", "Ninguna todavía"],
    minHoursIdx: 1,
    format: ["Online"],
    minAge: 14,
    requiresComputer: true,
    earn: "Variable (ingreso pasivo)",
    desc: "Plantillas, scripts o mini-guías que vendes una vez y cobras muchas veces.",
    next: "Empaqueta algo que ya sepas hacer y súbelo a Gumroad esta semana.",
  },
  {
    id: "contenido",
    name: "Contenido educativo (YouTube/TikTok)",
    category: ["Creativo", "Enseñar"],
    skills: ["Ninguna todavía"],
    minHoursIdx: 1,
    format: ["Online"],
    minAge: 13,
    earn: "A medio plazo, variable",
    desc: "Comparte lo que sabes en formato vídeo corto.",
    next: "Publica un vídeo por semana durante un mes antes de juzgar resultados.",
  },
  {
    id: "diseno",
    name: "Diseño gráfico básico",
    category: ["Creativo"],
    skills: ["Diseño"],
    minHoursIdx: 0,
    format: ["Online"],
    minAge: 15,
    requiresComputer: true,
    earn: "10–25 €/encargo",
    desc: "Logos, posts o carteles sencillos con Canva o Figma.",
    next: "Haz 3 diseños de práctica para un negocio ficticio y móntate un mini-portafolio.",
  },
  {
    id: "reparto",
    name: "Trabajo de temporada / ayudante local",
    category: ["Manual-práctico"],
    skills: ["Ninguna todavía"],
    minHoursIdx: 2,
    format: ["Presencial"],
    minAge: 16,
    earn: "6–9 €/hora",
    desc: "Trabajo presencial con autorización de tus padres o tutores.",
    next: "Pregunta en negocios cercanos y pide a tu familia que firme la autorización necesaria.",
  },
  {
    id: "traduccion",
    name: "Traducción y redacción con apoyo de IA",
    category: ["Tecnológico", "Creativo"],
    skills: ["Idiomas", "Ninguna todavía"],
    minHoursIdx: 0,
    format: ["Online"],
    minAge: 15,
    requiresComputer: true,
    earn: "10–20 € por encargo corto",
    desc: "Usas IA para ir rápido, tú aportas la revisión y el criterio.",
    next: "Ofrece tu primer encargo con descuento a cambio de una reseña.",
  },
  {
    id: "mascotas",
    name: "Cuidado de mascotas",
    category: ["Manual-práctico"],
    skills: ["Ninguna todavía"],
    minHoursIdx: 0,
    format: ["Presencial"],
    minAge: 14,
    earn: "8–12 €/hora o por servicio",
    desc: "Paseos, visitas o cuidado de mascotas de vecinos mientras están fuera.",
    next: "Ofrécete a vecinos y familiares, empieza gratis con el primer paseo para ganar confianza.",
  },
  {
    id: "jardineria",
    name: "Jardinería",
    category: ["Manual-práctico"],
    skills: ["Ninguna todavía"],
    minHoursIdx: 1,
    format: ["Presencial"],
    minAge: 15,
    earn: "8–15 €/hora",
    desc: "Cuidado de plantas, césped y jardines pequeños en tu barrio.",
    next: "Pregunta en tu vecindario quién necesita ayuda con el jardín este fin de semana.",
  },
  {
    id: "fotografia-eventos",
    name: "Fotografía para eventos",
    category: ["Creativo"],
    skills: ["Diseño", "Ninguna todavía"],
    minHoursIdx: 1,
    format: ["Presencial"],
    minAge: 16,
    earn: "30–80 € por evento",
    desc: "Cubre cumpleaños, fiestas o eventos pequeños con tu cámara o móvil.",
    next: "Ofrécete a fotografiar un evento familiar o de amigos y crea tu primer portafolio.",
  },
  {
    id: "reparacion-moviles",
    name: "Reparación de móviles",
    category: ["Manual-práctico", "Tecnológico"],
    skills: ["Ninguna todavía"],
    minHoursIdx: 1,
    format: ["Presencial"],
    minAge: 16,
    earn: "15–40 € por reparación",
    desc: "Cambios de pantalla, batería y pequeñas reparaciones para gente cercana.",
    next: "Aprende con tutoriales y practica en un móvil viejo antes de ofrecer el servicio.",
  },
  {
    id: "streaming-gaming",
    name: "Streaming/gaming de contenido",
    category: ["Creativo"],
    skills: ["Ninguna todavía"],
    minHoursIdx: 2,
    format: ["Online"],
    minAge: 13,
    earn: "A medio plazo, variable",
    desc: "Transmite o graba partidas y contenido gaming para construir una audiencia.",
    next: "Haz streams o vídeos regulares durante un mes antes de evaluar resultados.",
  },
  {
    id: "mercadillos",
    name: "Venta en mercadillos",
    category: ["Manual-práctico"],
    skills: ["Ninguna todavía"],
    minHoursIdx: 1,
    format: ["Presencial"],
    minAge: 14,
    earn: "Variable según ventas",
    desc: "Vende manualidades, ropa o artículos de segunda mano en mercadillos locales.",
    next: "Reúne unos primeros productos y busca un mercadillo cercano donde vender este mes.",
  },
];

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

function scoreOption(opt, answers) {
  if (Number(answers.age) < opt.minAge) return -1;
  const hoursIdx = HOURS_LEVELS.indexOf(answers.hours);
  if (hoursIdx < opt.minHoursIdx) return -1;
  if (answers.format !== "Me da igual" && !opt.format.includes(answers.format)) return -1;
  if (opt.requiresComputer && answers.computer === "No") return -1;

  let score = 0;
  if (opt.category.includes(answers.category)) score += 2;
  const chosenSkills = answers.skills || [];
  if (chosenSkills.some((s) => opt.skills.includes(s))) score += 2;
  if (answers.experience === "Sí") score += 1;
  return score;
}

function getRecommendations(answers) {
  const scored = OPTIONS.map((o) => ({ ...o, score: scoreOption(o, answers) }))
    .filter((o) => o.score >= 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, 4);
}

export default function IncomeSimulator() {
  const [step, setStep] = useState(-1); // -1 = portada
  const [answers, setAnswers] = useState({ skills: [] });
  const [done, setDone] = useState(false);
  const [dir, setDir] = useState(1); // 1 = avanzar, -1 = retroceder

  const current = STEPS[step];

  const canAdvance = () => {
    if (!current) return false;
    if (current.type === "number") return answers.age && Number(answers.age) > 0;
    if (current.type === "multi") return (answers[current.key] || []).length > 0;
    return !!answers[current.key];
  };

  const next = () => {
    setDir(1);
    if (step === STEPS.length - 1) {
      setDone(true);
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
  };

  const recs = done ? getRecommendations(answers) : [];

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

            {recs.length === 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
                No hemos encontrado opciones con estos filtros todavía. Prueba a
                ampliar el tiempo disponible o el formato de trabajo.
              </div>
            )}

            {recs.map((r) => (
              <div
                key={r.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-xl text-slate-50">{r.name}</h3>
                  <span className="inline-flex items-center gap-1 text-amber-400 text-sm whitespace-nowrap">
                    <Wallet className="w-4 h-4" /> {r.earn}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">{r.desc}</p>
                <div className="pt-2 border-t border-slate-800 text-sm text-slate-300">
                  <span className="text-slate-500">Primer paso: </span>
                  {r.next}
                </div>
              </div>
            ))}

            <button
              onClick={reset}
              className="w-full inline-flex items-center justify-center gap-2 text-slate-400 hover:text-slate-200 text-sm pt-2"
            >
              <RotateCcw className="w-4 h-4" /> Empezar de nuevo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
