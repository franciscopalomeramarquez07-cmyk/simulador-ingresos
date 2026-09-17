"use client";

import { useState } from "react";
import { Users, Copy, Check } from "lucide-react";

export default function CompareLink({ shareId }) {
  const [copied, setCopied] = useState(false);

  if (!shareId) return null;

  const url = () =>
    `${typeof window !== "undefined" ? window.location.origin : ""}/comparar/${shareId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Portapapeles no disponible en este navegador.
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Hice el Simulador de Ingresos, ¿te atreves a comparar tu resultado con el mío? ${url()}`
  )}`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 text-center">
      <div className="flex items-center justify-center gap-2 text-slate-50">
        <Users className="w-4 h-4 text-amber-400" />
        <span className="font-display text-base">Compara con un amigo</span>
      </div>
      <p className="text-slate-400 text-sm">
        Envíale este enlace: verá tu resultado, podrá hacer su propio test y comparar ambos.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-slate-300 border border-slate-700 rounded-full px-3 py-1.5 hover:border-amber-400 hover:text-amber-300 transition-colors"
        >
          WhatsApp
        </a>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-xs text-slate-300 border border-slate-700 rounded-full px-3 py-1.5 hover:border-amber-400 hover:text-amber-300 transition-colors"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Enlace copiado" : "Copiar enlace"}
        </button>
      </div>
    </div>
  );
}
