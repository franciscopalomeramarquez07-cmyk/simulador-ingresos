"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Wallet, Compass } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import { findMatches } from "../../../lib/jobMatching";
import Questionnaire from "../../../components/Questionnaire";
import ResultCard from "../../../components/ResultCard";

export default function CompararPage() {
  const { id } = useParams();
  const [amigo, setAmigo] = useState(null); // null = cargando, false = no encontrado, objeto = resultado
  const [miResultado, setMiResultado] = useState(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    fetch(`/api/comparar/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (active) setAmigo(data.encontrado ? data : false);
      })
      .catch(() => {
        if (active) setAmigo(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const handleFinish = async (answers) => {
    const [top] = findMatches(answers, 1);
    setMiResultado(top || null);
    try {
      await supabase.from("respuestas").insert({
        id: crypto.randomUUID(),
        age: Number(answers.age),
        category: answers.category,
        skills: answers.skills || [],
        experience: answers.experience,
        format: answers.format,
        computer: answers.computer,
        hours: answers.hours,
      });
    } catch {
      // No bloquear la experiencia del usuario si falla el guardado.
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 p-6">
      <div className="w-full max-w-3xl mx-auto font-body space-y-6 py-6">
        <div className="inline-flex items-center gap-2 text-amber-400">
          <Compass className="w-5 h-5" />
          <span className="text-sm tracking-wide">Simulador de Ingresos</span>
        </div>
        <h1 className="font-display text-3xl text-slate-50">Compara tu resultado</h1>

        {amigo === null && (
          <p className="text-slate-400 text-sm">Cargando el resultado de tu amigo/a...</p>
        )}

        {amigo === false && (
          <p className="text-slate-400 text-sm">
            No hemos encontrado ese resultado. Puede que el enlace esté mal copiado.{" "}
            <Link href="/" className="text-amber-400 hover:text-amber-300 underline">
              Ir al simulador
            </Link>
            .
          </p>
        )}

        {amigo && !miResultado && (
          <div className="space-y-6">
            <ResultCard index={0}>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Tu amigo/a obtuvo
                </p>
                <h2 className="font-display text-xl text-slate-50">{amigo.titulo}</h2>
                <p className="inline-flex items-center gap-1 text-amber-400 text-sm">
                  <Wallet className="w-4 h-4" /> {amigo.ingresoEstimadoMin}–
                  {amigo.ingresoEstimadoMax} €
                </p>
              </div>
            </ResultCard>
            <p className="text-slate-300 text-sm">
              Ahora responde tú el test para ver cómo se comparan vuestros resultados:
            </p>
            <Questionnaire onFinish={handleFinish} />
          </div>
        )}

        {amigo && miResultado && (
          <div className="space-y-5">
            <p className="text-slate-400 text-sm text-center">Estos son los dos resultados:</p>
            <div className="grid gap-4 md:grid-cols-2">
              <ResultCard index={0}>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2 h-full">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Tu amigo/a</p>
                  <h3 className="font-display text-lg text-slate-50">{amigo.titulo}</h3>
                  <p className="inline-flex items-center gap-1 text-amber-400 text-sm">
                    <Wallet className="w-4 h-4" /> {amigo.ingresoEstimadoMin}–
                    {amigo.ingresoEstimadoMax} €
                  </p>
                </div>
              </ResultCard>
              <ResultCard index={1}>
                <div className="bg-slate-900 border border-amber-400/40 rounded-2xl p-6 space-y-2 h-full">
                  <p className="text-xs uppercase tracking-wider text-amber-400">Tú</p>
                  <h3 className="font-display text-lg text-slate-50">{miResultado.titulo}</h3>
                  <p className="inline-flex items-center gap-1 text-amber-400 text-sm">
                    <Wallet className="w-4 h-4" /> {miResultado.ingresoEstimadoMin}–
                    {miResultado.ingresoEstimadoMax} €
                  </p>
                </div>
              </ResultCard>
            </div>
            <Link
              href="/"
              className="block text-center text-sm text-slate-400 hover:text-slate-200 underline"
            >
              Ir al simulador
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
