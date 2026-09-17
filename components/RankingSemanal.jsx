"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

export default function RankingSemanal() {
  const [ranking, setRanking] = useState(null);

  useEffect(() => {
    let active = true;
    fetch("/api/ranking")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (active) setRanking(data);
      })
      .catch(() => {
        if (active) setRanking([]);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!ranking || ranking.length === 0) return null;

  return (
    <div className="mt-10 text-left bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-md mx-auto">
      <h2 className="flex items-start gap-2 font-display text-lg text-slate-50 mb-3">
        <Flame className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        Esto es lo que la gente como tú está eligiendo esta semana
      </h2>
      <ol className="space-y-2">
        {ranking.map((item, i) => (
          <li key={item.id} className="flex items-center justify-between text-sm">
            <span className="text-slate-300">
              <span className="text-amber-400 font-semibold mr-2">{i + 1}.</span>
              {item.titulo}
            </span>
            <span className="text-slate-500 whitespace-nowrap">{item.count}x</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
