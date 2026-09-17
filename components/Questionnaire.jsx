"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { STEPS } from "../lib/steps";

export default function Questionnaire({ onFinish, onExit }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ skills: [] });
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
      onFinish(answers);
    } else {
      setStep(step + 1);
    }
  };

  const back = () => {
    if (step === 0) {
      if (onExit) onExit();
      return;
    }
    setDir(-1);
    setStep(step - 1);
  };

  const toggleMulti = (key, value) => {
    setAnswers((prev) => {
      const list = prev[key] || [];
      const exists = list.includes(value);
      const nextList = exists ? list.filter((v) => v !== value) : [...list, value];
      return { ...prev, [key]: nextList };
    });
  };

  return (
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
        {step > 0 || onExit ? (
          <button
            onClick={back}
            className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Atrás
          </button>
        ) : (
          <span />
        )}
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
  );
}
