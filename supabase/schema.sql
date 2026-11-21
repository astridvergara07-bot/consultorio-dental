-- Esquema para el sitio del consultorio dental.
-- Ejecutar en Supabase: panel del proyecto -> SQL Editor -> pegar y correr.

create table if not exists public.citas (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  nombre text not null,
  telefono text not null,
  mensaje text,
  atendida boolean not null default false
);

create table if not exists public.testimonios (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  nombre_paciente text not null,
  comentario text not null,
  aprobado boolean not null default false
);

create table if not exists public.configuracion (
  clave text primary key,
  valor text not null
);

insert into public.configuracion (clave, valor) values
  ('horario', 'Lunes a viernes, 8:00 am - 6:00 pm. Sabados, 8:00 am - 1:00 pm.'),
  ('direccion', ''),
  ('telefono', ''),
  ('whatsapp', '')
on conflict (clave) do nothing;

alter table public.citas enable row level security;
alter table public.testimonios enable row level security;
alter table public.configuracion enable row level security;

-- Cualquier visitante del sitio puede dejar una solicitud de cita o un testimonio
-- (insertar), pero solo un usuario autenticado (la doctora, via /admin) puede leerlos
-- o cambiarlos.
create policy "citas_insert_publico" on public.citas
  for insert to anon with check (true);

create policy "citas_select_autenticado" on public.citas
  for select to authenticated using (true);

create policy "citas_update_autenticado" on public.citas
  for update to authenticated using (true);

create policy "testimonios_insert_publico" on public.testimonios
  for insert to anon with check (true);

create policy "testimonios_select_aprobados_o_autenticado" on public.testimonios
  for select using (aprobado = true or auth.role() = 'authenticated');

create policy "testimonios_update_autenticado" on public.testimonios
  for update to authenticated using (true);

create policy "configuracion_select_publico" on public.configuracion
  for select using (true);

create policy "configuracion_update_autenticado" on public.configuracion
  for update to authenticated using (true);

-- Si al crear el proyecto quedo sin marcar "Grant API access to new tables
-- automatically", las policies de RLS de arriba no bastan: ademas hace falta el
-- permiso de tabla (GRANT) para que los roles anon/authenticated puedan tocarla.
grant select, insert on public.citas to anon;
grant select, update on public.citas to authenticated;

grant select, insert on public.testimonios to anon;
grant select, update, delete on public.testimonios to authenticated;

grant select on public.configuracion to anon;
grant select, update on public.configuracion to authenticated;

-- Despues de correr esto: Authentication -> Users -> "Add user" para crear el
-- login de la doctora (correo + contrasena). Ese es el unico usuario autenticado,
-- no hay registro publico.
