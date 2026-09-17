import { JOBS, Job } from "../data/jobs";

export interface Respuestas {
  age?: string | number;
  category?: string;
  skills?: string[];
  experience?: "Sí" | "No" | string;
  format?: "Online" | "Presencial" | "Me da igual" | string;
  computer?: "Sí" | "No" | string;
  hours?: string;
}

export interface JobMatch extends Job {
  score: number;
}

const HOURS_AVAILABLE_BY_LEVEL: Record<string, number> = {
  "Menos de 5h": 4,
  "5–10h": 8,
  "10–20h": 15,
  "Más de 20h": 25,
};

function scoreJob(job: Job, respuestas: Respuestas): number {
  let score = 0;

  if (respuestas.category && job.categorias.includes(respuestas.category)) {
    score += 3;
  }

  const skills = (respuestas.skills || []).filter((s) => s !== "Ninguna todavía");
  const skillMatches = skills.filter((s) => job.habilidadesClave.includes(s)).length;
  score += skillMatches * 2;

  if (respuestas.format === "Me da igual" || !respuestas.format) {
    score += 1;
  } else {
    const wanted = respuestas.format === "Online" ? "online" : "presencial";
    if (!job.formatos.includes(wanted)) return 0;
    score += 2;
  }

  const hoursAvailable = respuestas.hours ? HOURS_AVAILABLE_BY_LEVEL[respuestas.hours] : undefined;
  if (hoursAvailable !== undefined) {
    if (hoursAvailable < job.horasMin) return 0;
    score += 2;
  }

  if (job.requiereExperiencia) {
    if (respuestas.experience !== "Sí") return 0;
    score += 1;
  } else {
    score += 1;
  }

  return score;
}

export function findMatches(respuestas: Respuestas, limit = 6): JobMatch[] {
  return JOBS.map((job) => ({ ...job, score: scoreJob(job, respuestas) }))
    .filter((job) => job.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
