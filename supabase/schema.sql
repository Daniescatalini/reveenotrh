create table if not exists public.reveenorth_app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.reveenorth_app_state enable row level security;

create index if not exists reveenorth_app_state_updated_at_idx
on public.reveenorth_app_state (updated_at desc);

create or replace function public.set_reveenorth_app_state_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_reveenorth_app_state_updated_at on public.reveenorth_app_state;
create trigger set_reveenorth_app_state_updated_at
before update on public.reveenorth_app_state
for each row
execute function public.set_reveenorth_app_state_updated_at();

drop policy if exists "Users can read their ReveeNorth state" on public.reveenorth_app_state;
create policy "Users can read their ReveeNorth state"
on public.reveenorth_app_state
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their ReveeNorth state" on public.reveenorth_app_state;
create policy "Users can insert their ReveeNorth state"
on public.reveenorth_app_state
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their ReveeNorth state" on public.reveenorth_app_state;
create policy "Users can update their ReveeNorth state"
on public.reveenorth_app_state
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their ReveeNorth state" on public.reveenorth_app_state;
create policy "Users can delete their ReveeNorth state"
on public.reveenorth_app_state
for delete
to authenticated
using (auth.uid() = user_id);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.reveenorth_app_state to authenticated;
