-- ============================================================
--  OBEC × BENCHAN ESPORTS — โครงสร้างฐานข้อมูล
--  รันไฟล์นี้ใน Supabase → SQL Editor (รันครั้งเดียว)
-- ============================================================

create extension if not exists pgcrypto;

-- หมายเหตุ: เว็บรุ่นนี้ไม่มีระบบรับสมัครออนไลน์แล้ว
-- ถ้าฐานข้อมูลเดิมเคยมีตาราง registrations และไม่ต้องการเก็บไว้ ลบได้ด้วย
--   drop table if exists public.registrations;

-- ── ผู้ดูแลระบบ ──────────────────────────────────────────────
-- เพิ่มแถ  วที่นี่เพื่อให้บัญชีใน Authentication ใช้แผงผู้ดูแลได้
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- ── ตั้งค่างาน (แถวเดียว) ────────────────────────────────────
create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  event_name text not null default '',
  event_short text not null default '',
  tagline text not null default '',
  start_at timestamptz,
  end_at timestamptz,
  venue_name text not null default '',
  venue_address text not null default '',
  venue_maps_url text not null default '',
  live_note text not null default '',
  stream_url text not null default '',
  stream_live boolean not null default false,
  stream_note text not null default '',
  logo_url text not null default '',
  hero_image_url text not null default '',
  contact_line text not null default '',
  contact_phone text not null default '',
  contact_facebook text not null default '',
  updated_at timestamptz not null default now()
);

-- ── รายการที่เปิดแข่ง ───────────────────────────────────────
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  subtitle text default '',
  format text default '',
  players_per_team text default '',
  numeral text default '',
  sort int not null default 0
);

-- ── ทีมและนักกีฬา ───────────────────────────────────────────
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  school text,
  district text,
  division text check (division in ('junior', 'senior')),
  teacher text,
  seed int,
  logo_url text,
  color text,
  note text,
  status text not null default 'approved' check (status in ('pending', 'approved')),
  created_at timestamptz not null default now()
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  name text not null,
  ign text,
  level text,
  role text,
  is_sub boolean not null default false,
  sort int not null default 0
);

create index if not exists players_team_idx on public.players (team_id);

-- ── คู่การแข่งขัน ───────────────────────────────────────────
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  game_slug text not null default 'rov',
  division text check (division in ('junior', 'senior')),
  round_name text not null,
  round_order int not null default 1,
  slot int not null default 1,
  team_a_id uuid references public.teams (id) on delete set null,
  team_b_id uuid references public.teams (id) on delete set null,
  label_a text,
  label_b text,
  score_a int,
  score_b int,
  best_of int not null default 3,
  status text not null default 'wait' check (status in ('wait', 'live', 'done')),
  winner text check (winner in ('a', 'b')),
  scheduled_at timestamptz,
  note text,
  -- ผู้ชนะของแมตช์นี้จะถูกเลื่อนไปลงคู่ next_code ช่อง next_slot โดยอัตโนมัติ
  next_code text,
  next_slot int check (next_slot in (1, 2)),
  updated_at timestamptz not null default now()
);

-- สำหรับฐานข้อมูลที่สร้างไว้ก่อนหน้า — เพิ่มคอลัมน์ที่ยังไม่มี
alter table public.settings add column if not exists stream_url text not null default '';
alter table public.settings add column if not exists stream_live boolean not null default false;
alter table public.settings add column if not exists stream_note text not null default '';
alter table public.settings add column if not exists logo_url text not null default '';
alter table public.settings add column if not exists hero_image_url text not null default '';
-- ต้องทำก่อนสร้าง index เพราะ index อ้างถึงคอลัมน์เหล่านี้
alter table public.teams   add column if not exists division text;
alter table public.teams   add column if not exists teacher text;
alter table public.players add column if not exists level text;
alter table public.matches add column if not exists division text;
alter table public.matches add column if not exists label_a text;
alter table public.matches add column if not exists label_b text;
alter table public.matches add column if not exists next_code text;
alter table public.matches add column if not exists next_slot int;

create index if not exists matches_order_idx on public.matches (division, round_order, slot);

-- ต้องมี unique index บน code เพื่อให้ไฟล์ seed ใช้ on conflict (code) ได้
create unique index if not exists matches_code_key on public.matches (code);

-- ── กำหนดการ ────────────────────────────────────────────────
create table if not exists public.schedule_items (
  id uuid primary key default gen_random_uuid(),
  day date not null,
  day_title text default '',
  time text not null,
  title text not null,
  note text,
  tag text check (tag in ('open', 'key')),
  sort int not null default 0
);

-- ── เนื้อหาอื่น ─────────────────────────────────────────────
create table if not exists public.rules (
  id uuid primary key default gen_random_uuid(),
  heading text not null,
  body text not null,
  sort int not null default 0
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort int not null default 0
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  body text not null default '',
  cover_url text,
  published boolean not null default true,
  pinned boolean not null default false,
  published_at timestamptz not null default now()
);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  caption text,
  album text,
  sort int not null default 0
);

-- ── รางวัลการแข่งขัน ────────────────────────────────────────
create table if not exists public.prizes (
  id uuid primary key default gen_random_uuid(),
  place text not null,
  amount text default '',
  note text,
  sort int not null default 0
);

-- ── สกินที่ห้ามใช้ (ระเบียบข้อ 5.6) ─────────────────────────
create table if not exists public.banned_skins (
  id uuid primary key default gen_random_uuid(),
  hero text not null,
  skin text not null,
  sort int not null default 0
);

-- ── ตารางสรุปบทลงโทษ (ระเบียบข้อ 6.7) ───────────────────────
create table if not exists public.penalties (
  id uuid primary key default gen_random_uuid(),
  offense text not null,
  first_offense text not null default '',
  second_offense text,
  sort int not null default 0
);

create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tier text not null default 'support' check (tier in ('host', 'main', 'support')),
  logo_url text,
  url text,
  sort int not null default 0
);

-- ============================================================
--  Row Level Security
-- ============================================================

alter table public.admins enable row level security;
alter table public.settings enable row level security;
alter table public.games enable row level security;
alter table public.teams enable row level security;
alter table public.players enable row level security;
alter table public.matches enable row level security;
alter table public.schedule_items enable row level security;
alter table public.rules enable row level security;
alter table public.faqs enable row level security;
alter table public.news enable row level security;
alter table public.gallery enable row level security;
alter table public.sponsors enable row level security;
alter table public.prizes enable row level security;
alter table public.banned_skins enable row level security;
alter table public.penalties enable row level security;

-- ผู้ดูแลอ่านแถวของตัวเองได้ เพื่อให้เว็บตรวจสิทธิ์ได้
drop policy if exists admins_read_self on public.admins;
create policy admins_read_self on public.admins
  for select using (user_id = auth.uid());

-- ตารางเนื้อหาสาธารณะ: ใครก็อ่านได้ แก้ไขได้เฉพาะผู้ดูแล
do $$
declare
  t text;
begin
  foreach t in array array[
    'settings', 'games', 'teams', 'players', 'matches',
    'schedule_items', 'rules', 'faqs', 'news', 'gallery', 'sponsors', 'prizes', 'banned_skins', 'penalties'
  ]
  loop
    execute format('drop policy if exists %I_public_read on public.%I', t, t);
    execute format(
      'create policy %I_public_read on public.%I for select using (true)', t, t);

    execute format('drop policy if exists %I_admin_write on public.%I', t, t);
    execute format(
      'create policy %I_admin_write on public.%I for all
         using (public.is_admin()) with check (public.is_admin())', t, t);
  end loop;
end $$;

-- ============================================================
--  Realtime — ให้หน้าผลสดอัปเดตทันทีเมื่อกรรมการบันทึกคะแนน
-- ============================================================
do $$
begin
  begin
    alter publication supabase_realtime add table public.matches;
  exception
    when duplicate_object then null;
  end;
end $$;

alter table public.matches replica identity full;
