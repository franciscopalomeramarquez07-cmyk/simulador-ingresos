export const HOURS_LEVELS = ["Menos de 5h", "5–10h", "10–20h", "Más de 20h"];

export const STEPS = [
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
