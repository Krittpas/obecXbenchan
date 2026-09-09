"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { adminDb } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { getResource, type Field } from "@/lib/admin-schema";
import { parseBangkokLocal, slugify } from "@/lib/format";

export type ActionState = { ok: boolean; message: string };

function refreshSite() {
  revalidatePath("/", "layout");
}

/* ── เข้าสู่ระบบ ─────────────────────────────────────────── */

export async function signIn(_prev: ActionState, form: FormData): Promise<ActionState> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");

  const supabase = await createServerSupabase();
  if (!supabase) {
    return { ok: false, message: "ยังไม่ได้ตั้งค่า Supabase — ตั้งค่า environment variables ก่อนใช้งานแผงผู้ดูแล" };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return { ok: false, message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
  }

  const { data: allowed } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!allowed) {
    await supabase.auth.signOut();
    return { ok: false, message: "บัญชีนี้ยังไม่ได้รับสิทธิ์ผู้ดูแล กรุณาเพิ่ม user_id ลงตาราง admins" };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createServerSupabase();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}

/* ── CRUD ทั่วไปตามนิยามใน admin-schema ─────────────────── */

function coerce(field: Field, form: FormData): unknown {
  const raw = form.get(field.name);

  if (field.type === "checkbox") return raw === "on" || raw === "true";

  const value = String(raw ?? "").trim();
  if (value === "") return field.required ? "" : null;

  if (field.type === "number") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  if (field.type === "datetime") {
    return parseBangkokLocal(value)?.toISOString() ?? null;
  }
  return value;
}

export async function upsertRecord(form: FormData): Promise<void> {
  const resourceKey = String(form.get("__resource") ?? "");
  const resource = getResource(resourceKey);
  if (!resource) throw new Error("ไม่รู้จักตารางที่ต้องการแก้ไข");

  const db = await adminDb();
  const id = String(form.get("__id") ?? "").trim();

  const payload: Record<string, unknown> = {};
  for (const field of resource.fields) {
    payload[field.name] = coerce(field, form);
  }

  /* เติม slug ให้อัตโนมัติถ้าเว้นว่างไว้ */
  if ("slug" in payload && !payload.slug) {
    const source = payload[resource.primary];
    payload.slug = slugify(String(source ?? resourceKey));
  }

  const query = id
    ? db.from(resource.table).update(payload).eq("id", id)
    : db.from(resource.table).insert(payload);

  const { error } = await query;
  if (error) throw new Error(error.message);

  refreshSite();
  redirect(`/admin/${resourceKey}?saved=1`);
}

export async function deleteRecord(form: FormData): Promise<void> {
  const resourceKey = String(form.get("__resource") ?? "");
  const resource = getResource(resourceKey);
  if (!resource) throw new Error("ไม่รู้จักตารางที่ต้องการลบ");

  const id = String(form.get("__id") ?? "").trim();
  if (!id) throw new Error("ไม่พบรายการที่ต้องการลบ");

  const db = await adminDb();
  const { error } = await db.from(resource.table).delete().eq("id", id);
  if (error) throw new Error(error.message);

  refreshSite();
  redirect(`/admin/${resourceKey}?deleted=1`);
}

/* ── ควบคุมผลสดหน้างาน ──────────────────────────────────── */

type MatchLink = {
  team_a_id: string | null;
  team_b_id: string | null;
  next_code: string | null;
  next_slot: number | null;
};

/**
 * เลื่อนผู้ชนะของแมตช์ไปลงคู่ถัดไปตามผังสายโดยอัตโนมัติ
 * ถ้าแมตช์ยังไม่จบหรือแก้ผลใหม่ จะล้าง/เขียนทับช่องปลายทางให้ตรงกับผลล่าสุด
 */
async function advanceWinner(
  db: Awaited<ReturnType<typeof adminDb>>,
  match: MatchLink,
  status: string,
  winner: string | null,
) {
  if (!match.next_code || !match.next_slot) return;

  const column = match.next_slot === 2 ? "team_b_id" : "team_a_id";
  const winnerTeamId =
    winner === "a" ? match.team_a_id : winner === "b" ? match.team_b_id : null;

  if (status === "done" && winnerTeamId) {
    await db.from("matches").update({ [column]: winnerTeamId }).eq("code", match.next_code);
    return;
  }

  /* ยังไม่จบหรือยังไม่รู้ผู้ชนะ — ล้างช่องปลายทางเฉพาะเมื่อค่าที่ค้างอยู่มาจากคู่นี้จริง */
  const { data: next } = await db
    .from("matches")
    .select("team_a_id, team_b_id")
    .eq("code", match.next_code)
    .maybeSingle();

  const held = (next as Record<string, string | null> | null)?.[column] ?? null;
  if (held && (held === match.team_a_id || held === match.team_b_id)) {
    await db.from("matches").update({ [column]: null }).eq("code", match.next_code);
  }
}

export async function updateScore(form: FormData): Promise<void> {
  const db = await adminDb();
  const id = String(form.get("id") ?? "");
  if (!id) throw new Error("ไม่พบคู่แข่งขัน");

  const scoreA = Number(form.get("score_a") ?? 0);
  const scoreB = Number(form.get("score_b") ?? 0);
  const status = String(form.get("status") ?? "wait");
  const winnerRaw = String(form.get("winner") ?? "");

  /* ถ้าจบแมตช์แล้วยังไม่ได้เลือกผู้ชนะ ให้ตัดสินจากคะแนน */
  let winner: string | null = winnerRaw || null;
  if (status === "done" && !winner && scoreA !== scoreB) {
    winner = scoreA > scoreB ? "a" : "b";
  }
  if (status !== "done") winner = null;

  const { data: current, error: readError } = await db
    .from("matches")
    .select("team_a_id, team_b_id, next_code, next_slot")
    .eq("id", id)
    .single();
  if (readError || !current) throw new Error(readError?.message ?? "ไม่พบคู่แข่งขัน");

  const { error } = await db
    .from("matches")
    .update({
      score_a: Number.isFinite(scoreA) ? scoreA : null,
      score_b: Number.isFinite(scoreB) ? scoreB : null,
      status,
      winner,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await advanceWinner(db, current as unknown as MatchLink, status, winner);

  refreshSite();
  redirect("/admin/live?saved=1");
}

/* ── ตั้งค่างาน ─────────────────────────────────────────── */

const SETTINGS_TEXT_FIELDS = [
  "event_name",
  "event_short",
  "tagline",
  "venue_name",
  "venue_address",
  "venue_maps_url",
  "live_note",
  "stream_url",
  "stream_note",
  "logo_url",
  "hero_image_url",
  "contact_line",
  "contact_phone",
  "contact_facebook",
] as const;

export async function saveSettings(form: FormData): Promise<void> {
  const db = await adminDb();

  const payload: Record<string, unknown> = { id: 1 };
  for (const key of SETTINGS_TEXT_FIELDS) {
    payload[key] = String(form.get(key) ?? "").trim();
  }
  for (const key of ["start_at", "end_at"] as const) {
    const date = parseBangkokLocal(String(form.get(key) ?? ""));
    payload[key] = date ? date.toISOString() : null;
  }
  payload.stream_live = form.get("stream_live") === "on";

  const { error } = await db.from("settings").upsert(payload, { onConflict: "id" });
  if (error) throw new Error(error.message);

  refreshSite();
  redirect("/admin/settings?saved=1");
}
