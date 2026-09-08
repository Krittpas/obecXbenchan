"use server";

import { createAdminSupabase } from "@/lib/supabase/admin";
import { publicSupabase } from "@/lib/supabase/public";
import { getSettings } from "@/lib/queries";
import type { RegistrationPlayer } from "@/lib/types";

export type RegisterState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
};

const MAX_PLAYERS = 8;

function text(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

export async function submitRegistration(
  _prev: RegisterState,
  form: FormData,
): Promise<RegisterState> {
  /* กับดักบอท — ช่องนี้ถูกซ่อนไว้ คนกรอกจริงจะไม่มีค่า */
  if (text(form, "website")) {
    return { ok: true, message: "ส่งใบสมัครเรียบร้อยแล้ว" };
  }

  const settings = await getSettings();
  if (!settings.register_open) {
    return { ok: false, message: "ขณะนี้ปิดรับสมัครแล้ว หากมีข้อสงสัยกรุณาติดต่อฝ่ายจัดการแข่งขัน" };
  }

  const teamName = text(form, "team_name");
  const school = text(form, "school");
  const district = text(form, "district");
  const gameSlug = text(form, "game_slug") || "rov";
  const managerName = text(form, "manager_name");
  const managerPhone = text(form, "manager_phone");
  const managerEmail = text(form, "manager_email");
  const note = text(form, "note");
  const accept = form.get("accept") === "on";

  const errors: Record<string, string> = {};
  if (teamName.length < 2) errors.team_name = "กรุณากรอกชื่อทีม";
  if (school.length < 2) errors.school = "กรุณากรอกชื่อสถานศึกษา";
  if (managerName.length < 2) errors.manager_name = "กรุณากรอกชื่อผู้จัดการทีม";
  if (!/^[0-9\-+\s]{9,20}$/.test(managerPhone)) errors.manager_phone = "กรุณากรอกเบอร์ติดต่อให้ถูกต้อง";
  if (managerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(managerEmail))
    errors.manager_email = "รูปแบบอีเมลไม่ถูกต้อง";
  if (!accept) errors.accept = "กรุณายอมรับระเบียบการแข่งขัน";

  const players: RegistrationPlayer[] = [];
  for (let i = 0; i < MAX_PLAYERS; i += 1) {
    const name = text(form, `player_name_${i}`);
    if (!name) continue;
    players.push({
      name,
      ign: text(form, `player_ign_${i}`),
      role: text(form, `player_role_${i}`),
      is_sub: form.get(`player_sub_${i}`) === "on",
    });
  }
  if (players.filter((p) => !p.is_sub).length < 1) {
    errors.players = "กรุณากรอกรายชื่อนักกีฬาตัวจริงอย่างน้อย 1 คน";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, message: "กรอกข้อมูลไม่ครบถ้วน กรุณาตรวจสอบช่องที่แจ้งเตือน", errors };
  }

  const db = createAdminSupabase() ?? publicSupabase();
  if (!db) {
    return {
      ok: false,
      message:
        "ระบบยังไม่ได้เชื่อมต่อฐานข้อมูล กรุณาตั้งค่า Supabase ก่อน หรือติดต่อฝ่ายจัดการแข่งขันโดยตรง",
    };
  }

  const { error } = await db.from("registrations").insert({
    team_name: teamName,
    school,
    district: district || null,
    game_slug: gameSlug,
    manager_name: managerName,
    manager_phone: managerPhone,
    manager_email: managerEmail || null,
    players,
    note: note || null,
    status: "pending",
  });

  if (error) {
    return { ok: false, message: `บันทึกใบสมัครไม่สำเร็จ: ${error.message}` };
  }

  return {
    ok: true,
    message:
      "ส่งใบสมัครเรียบร้อยแล้ว ฝ่ายจัดการแข่งขันจะติดต่อกลับตามเบอร์ที่ให้ไว้เพื่อยืนยันสิทธิ์",
  };
}
