/* โดเมนหลักของงาน OBEC × BENCHAN ESPORTS
   ชนิดข้อมูลตรงกับตารางใน supabase/migrations/0001_init.sql */

export type MatchStatus = "wait" | "live" | "done";
/** รุ่นการแข่งขัน — junior = ม.ต้น, senior = ม.ปลาย */
export type Division = "junior" | "senior";
export type Side = "a" | "b";
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
  live_note: string;
  /** ลิงก์ถ่ายทอดสด รองรับ YouTube / Facebook / Twitch หรือ URL ฝังอื่น */
  stream_url: string;
  /** เปิดเป็นจริงเมื่อกำลังถ่ายทอดสดอยู่ */
  stream_live: boolean;
  stream_note: string;
  /** โลโก้งาน แสดงบนหัวเว็บแทนสัญลักษณ์หกเหลี่ยม */
  logo_url: string;
  /** ภาพพื้นหลังส่วนฮีโร่หน้าแรก */
  hero_image_url: string;
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
  /** ระดับชั้น เช่น ม.5/4 */
  level: string | null;
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
  division: Division | null;
  /** ครูผู้ควบคุมทีม */
  teacher: string | null;
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
  division: Division | null;
  round_name: string;
  round_order: number;
  slot: number;
  team_a_id: string | null;
  team_b_id: string | null;
  /** ข้อความแทนชื่อทีมเมื่อยังไม่ทราบผู้ผ่านเข้ารอบ เช่น "ผู้ชนะคู่ J-A" */
  label_a: string | null;
  label_b: string | null;
  score_a: number | null;
  score_b: number | null;
  best_of: number;
  status: MatchStatus;
  winner: Side | null;
  scheduled_at: string | null;
  note: string | null;
  /** รหัสคู่ที่ผู้ชนะของแมตช์นี้จะไปเล่นต่อ (null = คู่สุดท้ายของสาย) */
  next_code: string | null;
  /** ผู้ชนะจะไปเป็นทีมฝั่งไหนของคู่ถัดไป — 1 = ทีม A, 2 = ทีม B */
  next_slot: number | null;
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
export type Prize = {
  id: string;
  place: string;
  amount: string;
  note: string | null;
  sort: number;
};

export type BannedSkin = {
  id: string;
  hero: string;
  skin: string;
  sort: number;
};

export type Penalty = {
  id: string;
  offense: string;
  first_offense: string;
  second_offense: string | null;
  sort: number;
};

export type Sponsor = {
  id: string;
  name: string;
  tier: "host" | "main" | "support";
  logo_url: string | null;
  url: string | null;
  sort: number;
};

export type Round = { name: string; order: number; matches: Match[] };

export const DIVISION_LABEL: Record<Division, string> = {
  junior: "รุ่น ม.ต้น",
  senior: "รุ่น ม.ปลาย",
};
