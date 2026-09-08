/* โดเมนหลักของงาน OBEC × BENCHAMA ESPORTS
   ชนิดข้อมูลตรงกับตารางใน supabase/migrations/0001_init.sql */

export type MatchStatus = "wait" | "live" | "done";
export type Side = "a" | "b";
export type RegistrationStatus = "pending" | "approved" | "rejected";
export type TeamStatus = "pending" | "approved";

export type Settings = {
  event_name: string;
  event_short: string;
  tagline: string;
  start_at: string;
  end_at: string;
  venue_name: string;
  venue_address: string;
  venue_maps_url: string;
  register_open: boolean;
  register_deadline: string | null;
  live_note: string;
  contact_line: string;
  contact_phone: string;
  contact_facebook: string;
};

export type Game = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  format: string;
  players_per_team: string;
  numeral: string;
  sort: number;
};

export type Player = {
  id: string;
  team_id: string;
  name: string;
  ign: string | null;
  role: string | null;
  is_sub: boolean;
  sort: number;
};

export type Team = {
  id: string;
  slug: string;
  name: string;
  school: string | null;
  district: string | null;
  seed: number | null;
  logo_url: string | null;
  note: string | null;
  status: TeamStatus;
  color: string | null;
  players?: Player[];
};

export type Match = {
  id: string;
  code: string;
  game_slug: string;
  round_name: string;
  round_order: number;
  slot: number;
  team_a_id: string | null;
  team_b_id: string | null;
  score_a: number | null;
  score_b: number | null;
  best_of: number;
  status: MatchStatus;
  winner: Side | null;
  scheduled_at: string | null;
  note: string | null;
  /* เติมให้ตอน query */
  team_a?: Team | null;
  team_b?: Team | null;
};

export type ScheduleItem = {
  id: string;
  day: string;
  day_title: string;
  time: string;
  title: string;
  note: string | null;
  tag: "open" | "key" | null;
  sort: number;
};

export type NewsPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  cover_url: string | null;
  published: boolean;
  pinned: boolean;
  published_at: string;
};

export type GalleryItem = {
  id: string;
  url: string;
  caption: string | null;
  album: string | null;
  sort: number;
};

export type Rule = { id: string; heading: string; body: string; sort: number };
export type Faq = { id: string; question: string; answer: string; sort: number };
export type Sponsor = {
  id: string;
  name: string;
  tier: "host" | "main" | "support";
  logo_url: string | null;
  url: string | null;
  sort: number;
};

export type RegistrationPlayer = {
  name: string;
  ign: string;
  role: string;
  is_sub: boolean;
};

export type Registration = {
  id: string;
  team_name: string;
  school: string;
  district: string | null;
  game_slug: string;
  manager_name: string;
  manager_phone: string;
  manager_email: string | null;
  players: RegistrationPlayer[];
  note: string | null;
  status: RegistrationStatus;
  created_at: string;
};

export type Round = { name: string; order: number; matches: Match[] };
