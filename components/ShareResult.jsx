"use client";

import { useState } from "react";
import { Share2, Copy, Check, ImageDown } from "lucide-react";

export default function ShareResult({ titulo, min, max }) {
  const [showFallback, setShowFallback] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);

  const getOrigin = () => (typeof window !== "undefined" ? window.location.origin : "");

  const buildParams = () => {
    const params = new URLSearchParams({ titulo });
    if (min != null) params.set("min", String(min));
    if (max != null) params.set("max", String(max));
    return params;
  };

  const shareUrl = () => `${getOrigin()}/resultado?${buildParams().toString()}`;
  const imageUrl = () => `${getOrigin()}/api/og?${buildParams().toString()}`;

  const shareText = `Según el Simulador de Ingresos, podría dedicarme a "${titulo}"${
    min != null && max != null ? ` y ganar ${min}–${max} €` : ""
  }. Descubre tu opción:`;

  const handleShare = async () => {
    const url = shareUrl();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Simulador de Ingresos", text: shareText, url });
        return;
      } catch {
        // Usuario canceló el share nativo: mostramos las alternativas.
      }
    }
    setShowFallback((v) => !v);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Portapapeles no disponible en este navegador.
    }
  };

  const handleCopyImage = async () => {
    try {
      const res = await fetch(imageUrl());
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      setImageCopied(true);
      setTimeout(() => setImageCopied(false), 2000);
    } catch {
      // Clipboard de imágenes no soportado: la persona puede usar "Copiar enlace".
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl()}`)}`;

  return (
    <div className="pt-1">
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 text-xs text-slate-300 border border-slate-700 rounded-full px-3 py-1.5 hover:border-amber-400 hover:text-amber-300 transition-colors"
      >
        <Share2 className="w-3.5 h-3.5" /> Compartir resultado
      </button>

      {showFallback && (
        <div className="flex flex-wrap gap-2 mt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-slate-300 border border-slate-700 rounded-full px-3 py-1 hover:border-amber-400 hover:text-amber-300 transition-colors"
          >
            WhatsApp
          </a>
          <button
            onClick={handleCopyImage}
            className="inline-flex items-center gap-1 text-xs text-slate-300 border border-slate-700 rounded-full px-3 py-1 hover:border-amber-400 hover:text-amber-300 transition-colors"
          >
            <ImageDown className="w-3 h-3" />
            {imageCopied ? "Imagen copiada" : "Copiar imagen (Instagram)"}
          </button>
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1 text-xs text-slate-300 border border-slate-700 rounded-full px-3 py-1 hover:border-amber-400 hover:text-amber-300 transition-colors"
          >
            {linkCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {linkCopied ? "Enlace copiado" : "Copiar enlace"}
          </button>
        </div>
      )}
    </div>
  );
}
