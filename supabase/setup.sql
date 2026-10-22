-- Run once in the Supabase dashboard: SQL Editor → New query → paste → Run.

-- Email list from the first-visit prompt and the "Send me updates" option.
create table if not exists public.subscribers (
  email      text primary key check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  source     text not null default 'site',
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;

-- Newer Supabase projects don't grant table access by default; allow the
-- website to add rows only (no select, update or delete).
grant insert on public.subscribers to anon, authenticated;

-- Visitors may add themselves to the list, but nobody can read, change or
-- delete it from the website. You see the list in the Supabase dashboard.
drop policy if exists "Anyone can subscribe" on public.subscribers;
create policy "Anyone can subscribe"
  on public.subscribers for insert
  to anon, authenticated
  with check (true);
