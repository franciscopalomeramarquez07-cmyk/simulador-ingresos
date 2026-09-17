import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import { findMatches, Respuestas } from "../../../../lib/jobMatching";

export const dynamic = "force-dynamic";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ encontrado: false }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("respuestas")
      .select("category, skills, experience, format, hours")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ encontrado: false }, { status: 404 });
    }

    const respuestas: Respuestas = {
      category: data.category,
      skills: data.skills || [],
      experience: data.experience,
      format: data.format,
      hours: data.hours,
    };

    const [top] = findMatches(respuestas, 1);
    if (!top) {
      return NextResponse.json({ encontrado: false }, { status: 200 });
    }

    return NextResponse.json({
      encontrado: true,
      titulo: top.titulo,
      ingresoEstimadoMin: top.ingresoEstimadoMin,
      ingresoEstimadoMax: top.ingresoEstimadoMax,
    });
  } catch (err) {
    console.error("Error leyendo resultado para comparar:", err);
    return NextResponse.json({ encontrado: false }, { status: 500 });
  }
}
