import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";
import { findMatches, Respuestas } from "../../../lib/jobMatching";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("respuestas")
      .select("category, skills, experience, format, hours")
      .gte("created_at", sevenDaysAgo);

    if (error) throw error;

    const counts = new Map<string, { titulo: string; count: number }>();

    for (const row of data || []) {
      const respuestas: Respuestas = {
        category: row.category,
        skills: row.skills || [],
        experience: row.experience,
        format: row.format,
        hours: row.hours,
      };

      const [top] = findMatches(respuestas, 1);
      if (!top) continue;

      const existing = counts.get(top.id);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(top.id, { titulo: top.titulo, count: 1 });
      }
    }

    const ranking = Array.from(counts.entries())
      .map(([id, value]) => ({ id, titulo: value.titulo, count: value.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json(ranking);
  } catch (err) {
    console.error("Error calculando el ranking semanal:", err);
    return NextResponse.json([], { status: 200 });
  }
}
