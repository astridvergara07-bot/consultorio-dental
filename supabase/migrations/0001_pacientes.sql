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

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'pacientes' and policyname = 'pacientes_todo_autenticado') then
    create policy "pacientes_todo_autenticado" on public.pacientes
      for all to authenticated using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'historial_pacientes' and policyname = 'historial_todo_autenticado') then
    create policy "historial_todo_autenticado" on public.historial_pacientes
      for all to authenticated using (true) with check (true);
  end if;
end $$;

grant select, insert, update, delete on public.pacientes to authenticated;
grant select, insert, update, delete on public.historial_pacientes to authenticated;

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
