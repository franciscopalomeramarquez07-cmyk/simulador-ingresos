-- Tabla para guardar las respuestas del cuestionario del simulador.
create table if not exists public.respuestas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  age smallint,
  category text,
  skills text[],
  experience text,
  format text,
  computer text,
  hours text
);

-- Activa RLS: sin políticas, todo el acceso queda bloqueado por defecto.
alter table public.respuestas enable row level security;

-- Único permiso: insertar filas nuevas desde el rol anon (cuestionario público).
create policy "anon puede insertar respuestas"
  on public.respuestas
  for insert
  to anon
  with check (true);

-- No se crean políticas de SELECT, UPDATE ni DELETE para "anon":
-- con RLS activo, cualquier operación sin política coincidente queda denegada.
