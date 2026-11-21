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

-- Seguimiento de pacientes: datos basicos + historial de tratamientos. Son datos
-- privados del consultorio, por eso no se le da ningun permiso al rol "anon" en
-- estas dos tablas (ni select) - solo la doctora autenticada puede verlos.
create table if not exists public.pacientes (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  nombre text not null,
  telefono text not null unique,
  correo text,
  fecha_nacimiento date,
  notas_generales text,
  proxima_cita date,
  cita_origen_id uuid references public.citas(id)
);

create table if not exists public.historial_pacientes (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references public.pacientes(id) on delete cascade,
  fecha date not null default current_date,
  procedimiento text not null,
  notas text,
  creado_en timestamptz not null default now()
);

alter table public.pacientes enable row level security;
alter table public.historial_pacientes enable row level security;

create policy "pacientes_todo_autenticado" on public.pacientes
  for all to authenticated using (true) with check (true);

create policy "historial_todo_autenticado" on public.historial_pacientes
  for all to authenticated using (true) with check (true);

grant select, insert, update, delete on public.pacientes to authenticated;
grant select, insert, update, delete on public.historial_pacientes to authenticated;

-- Cuando llega una solicitud de cita desde el formulario publico, se crea (o
-- reutiliza, si el telefono ya existe) el registro de paciente automaticamente.
-- security definer: corre con permisos de quien la creo, no del visitante anonimo
-- que disparo el insert en citas, asi puede escribir en pacientes aunque anon no
-- tenga permiso directo sobre esa tabla.
create or replace function public.fn_citas_crear_paciente()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.pacientes (nombre, telefono, cita_origen_id)
  values (new.nombre, new.telefono, new.id)
  on conflict (telefono) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_citas_crear_paciente on public.citas;
create trigger trg_citas_crear_paciente
  after insert on public.citas
  for each row execute function public.fn_citas_crear_paciente();
