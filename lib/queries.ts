import "server-only";

import {
  fallbackFaqs,
  fallbackGallery,
  fallbackGames,
  fallbackMatches,
  fallbackNews,
  fallbackRules,
  fallbackSchedule,
  fallbackSettings,
  fallbackSponsors,
  fallbackTeams,
} from "./fallback";
import { publicSupabase } from "./supabase/public";
import type {
  Division,
  Faq,
  GalleryItem,
  Game,
  Match,
  NewsPost,
  Round,
  Rule,
  ScheduleItem,
  Settings,
  Sponsor,
  Team,
} from "./types";

/** อ่านจาก Supabase ถ้าตั้งค่าไว้ ถ้าไม่ได้ตั้งหรือพัง ให้ตกกลับไปใช้ข้อมูลตัวอย่าง */
async function read<T>(
  run: (db: NonNullable<ReturnType<typeof publicSupabase>>) => PromiseLike<{ data: unknown; error: unknown }>,
  fallback: T,
): Promise<T> {
  const db = publicSupabase();
  if (!db) return fallback;
  try {
    const { data, error } = await run(db);
    if (error || !data || (Array.isArray(data) && data.length === 0)) return fallback;
    return data as T;
  } catch {
    return fallback;
  }
}

export async function getSettings(): Promise<Settings> {
  const rows = await read<Settings[]>(
    (db) => db.from("settings").select("*").eq("id", 1).limit(1),
    [fallbackSettings],
  );
  return { ...fallbackSettings, ...(rows[0] ?? {}) };
}

export async function getGames(): Promise<Game[]> {
  return read<Game[]>((db) => db.from("games").select("*").order("sort"), fallbackGames);
}

export async function getTeams(): Promise<Team[]> {
  return read<Team[]>(
    (db) =>
      db
        .from("teams")
        .select("*, players(*)")
        .eq("status", "approved")
        .order("division", { ascending: true })
        .order("seed", { ascending: true, nullsFirst: false }),
    fallbackTeams,
  );
}

export async function getTeam(slug: string): Promise<Team | null> {
  const rows = await read<Team[]>(
    (db) => db.from("teams").select("*, players(*)").eq("slug", slug).limit(1),
    fallbackTeams.filter((x) => x.slug === slug),
  );
  const found = rows[0] ?? null;
  if (!found) return null;
  const players = [...(found.players ?? [])].sort((a, b) => a.sort - b.sort);
  return { ...found, players };
}

const MATCH_SELECT =
  "*, team_a:teams!matches_team_a_id_fkey(*), team_b:teams!matches_team_b_id_fkey(*)";

export async function getMatches(): Promise<Match[]> {
  return read<Match[]>(
    (db) =>
      db.from("matches").select(MATCH_SELECT).order("division").order("round_order").order("slot"),
    fallbackMatches,
  );
}

export const DIVISIONS: Division[] = ["junior", "senior"];

/** แยกข้อมูลตามรุ่น ม.ต้น / ม.ปลาย โดยคงลำดับเดิมไว้ */
export function byDivision<T extends { division: Division | null }>(rows: T[]) {
  return {
    junior: rows.filter((r) => r.division === "junior"),
    senior: rows.filter((r) => r.division === "senior"),
    none: rows.filter((r) => !r.division),
  };
}

/** จัดกลุ่มแมตช์เป็นรอบ เรียงตามลำดับรอบ ใช้วาดผังสายการแข่งขัน */
export function groupRounds(matches: Match[]): Round[] {
  const map = new Map<number, Round>();
  for (const item of matches) {
    const round = map.get(item.round_order) ?? {
      name: item.round_name,
      order: item.round_order,
      matches: [],
    };
    round.matches.push(item);
    map.set(item.round_order, round);
  }
  return [...map.values()]
    .sort((a, b) => a.order - b.order)
    .map((r) => ({ ...r, matches: r.matches.sort((a, b) => a.slot - b.slot) }));
}

export async function getSchedule(): Promise<ScheduleItem[]> {
  return read<ScheduleItem[]>(
    (db) => db.from("schedule_items").select("*").order("day").order("sort"),
    fallbackSchedule,
  );
}

export async function getRules(): Promise<Rule[]> {
  return read<Rule[]>((db) => db.from("rules").select("*").order("sort"), fallbackRules);
}

export async function getFaqs(): Promise<Faq[]> {
  return read<Faq[]>((db) => db.from("faqs").select("*").order("sort"), fallbackFaqs);
}

export async function getNews(limit?: number): Promise<NewsPost[]> {
  const rows = await read<NewsPost[]>(
    (db) =>
      db
        .from("news")
        .select("*")
        .eq("published", true)
        .order("pinned", { ascending: false })
        .order("published_at", { ascending: false }),
    fallbackNews,
  );
  return limit ? rows.slice(0, limit) : rows;
}

export async function getNewsPost(slug: string): Promise<NewsPost | null> {
  const rows = await read<NewsPost[]>(
    (db) => db.from("news").select("*").eq("slug", slug).eq("published", true).limit(1),
    fallbackNews.filter((x) => x.slug === slug),
  );
  return rows[0] ?? null;
}

export async function getGallery(): Promise<GalleryItem[]> {
  return read<GalleryItem[]>(
    (db) => db.from("gallery").select("*").order("sort"),
    fallbackGallery,
  );
}

export async function getSponsors(): Promise<Sponsor[]> {
  return read<Sponsor[]>((db) => db.from("sponsors").select("*").order("sort"), fallbackSponsors);
}

/** ตารางอันดับคำนวณจากผลแมตช์ที่จบแล้ว */
export type StandingRow = {
  team: Team;
  played: number;
  won: number;
  lost: number;
  gamesWon: number;
  gamesLost: number;
  diff: number;
};

export function buildStandings(teams: Team[], matches: Match[]): StandingRow[] {
  const table = new Map<string, StandingRow>(
    teams.map((team) => [
      team.id,
      { team, played: 0, won: 0, lost: 0, gamesWon: 0, gamesLost: 0, diff: 0 },
    ]),
  );

  for (const m of matches) {
    if (m.status !== "done" || !m.team_a_id || !m.team_b_id) continue;
    const a = table.get(m.team_a_id);
    const b = table.get(m.team_b_id);
    const sa = m.score_a ?? 0;
    const sb = m.score_b ?? 0;
    if (a) {
      a.played += 1;
      a.gamesWon += sa;
      a.gamesLost += sb;
      if (m.winner === "a") a.won += 1;
      else a.lost += 1;
    }
    if (b) {
      b.played += 1;
      b.gamesWon += sb;
      b.gamesLost += sa;
      if (m.winner === "b") b.won += 1;
      else b.lost += 1;
    }
  }

  return [...table.values()]
    .map((row) => ({ ...row, diff: row.gamesWon - row.gamesLost }))
    .sort(
      (x, y) =>
        y.won - x.won ||
        y.diff - x.diff ||
        y.gamesWon - x.gamesWon ||
        (x.team.seed ?? 99) - (y.team.seed ?? 99),
    );
}
