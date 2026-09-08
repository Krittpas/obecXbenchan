"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitRegistration, type RegisterState } from "@/app/register/actions";
import type { Game } from "@/lib/types";

const INITIAL: RegisterState = { ok: false, message: "" };
const MIN_ROWS = 5;
const MAX_ROWS = 8;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-gold" type="submit" disabled={pending}>
      {pending ? "กำลังส่งใบสมัคร…" : "ส่งใบสมัคร"}
    </button>
  );
}

export default function RegisterForm({ games }: { games: Game[] }) {
  const [state, action] = useActionState(submitRegistration, INITIAL);
  const [rows, setRows] = useState(MIN_ROWS + 1);

  if (state.ok) {
    return (
      <div className="alert alert-ok" role="status">
        <b>{state.message}</b>
        <p style={{ marginTop: "0.4rem" }}>
          กรุณาเตรียมหนังสือรับรองจากสถานศึกษาและบัตรประจำตัวนักเรียนมาแสดงในวันแข่งขัน
        </p>
      </div>
    );
  }

  const err = state.errors ?? {};

  return (
    <form action={action} noValidate>
      {state.message && (
        <div className="alert alert-err" role="alert">
          {state.message}
        </div>
      )}

      {/* กับดักบอท — ซ่อนจากผู้ใช้จริง */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
      />

      <div className="panel">
        <h2>ข้อมูลทีม</h2>

        <div className="field-row">
          <div className="field">
            <label htmlFor="team_name">ชื่อทีม *</label>
            <input id="team_name" name="team_name" type="text" required maxLength={80} />
            {err.team_name && <span className="hint" style={{ color: "var(--red)" }}>{err.team_name}</span>}
          </div>
          <div className="field">
            <label htmlFor="game_slug">รายการที่สมัคร *</label>
            <select id="game_slug" name="game_slug" defaultValue={games[0]?.slug ?? "rov"}>
              {games.map((g) => (
                <option key={g.id} value={g.slug}>
                  {g.name} — {g.subtitle}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="school">สถานศึกษา *</label>
            <input id="school" name="school" type="text" required maxLength={120} />
            {err.school && <span className="hint" style={{ color: "var(--red)" }}>{err.school}</span>}
          </div>
          <div className="field">
            <label htmlFor="district">อำเภอ / เขตพื้นที่</label>
            <input id="district" name="district" type="text" maxLength={80} />
          </div>
        </div>
      </div>

      <div className="panel">
        <h2>ผู้จัดการทีม / ครูผู้ควบคุม</h2>
        <div className="field-row">
          <div className="field">
            <label htmlFor="manager_name">ชื่อ–สกุล *</label>
            <input id="manager_name" name="manager_name" type="text" required maxLength={80} />
            {err.manager_name && (
              <span className="hint" style={{ color: "var(--red)" }}>{err.manager_name}</span>
            )}
          </div>
          <div className="field">
            <label htmlFor="manager_phone">เบอร์โทรศัพท์ *</label>
            <input id="manager_phone" name="manager_phone" type="tel" required maxLength={20} />
            {err.manager_phone && (
              <span className="hint" style={{ color: "var(--red)" }}>{err.manager_phone}</span>
            )}
          </div>
        </div>
        <div className="field">
          <label htmlFor="manager_email">อีเมล</label>
          <input id="manager_email" name="manager_email" type="email" maxLength={120} />
          {err.manager_email && (
            <span className="hint" style={{ color: "var(--red)" }}>{err.manager_email}</span>
          )}
        </div>
      </div>

      <div className="panel">
        <h2>รายชื่อนักกีฬา</h2>
        <p className="hint" style={{ marginBottom: "1rem" }}>
          กรอกตัวจริงให้ครบตามจำนวนของรายการที่สมัคร และติ๊ก “สำรอง” สำหรับผู้เล่นสำรอง
        </p>
        {err.players && (
          <div className="alert alert-err" role="alert">
            {err.players}
          </div>
        )}

        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr 0.9fr auto",
              gap: "0.6rem",
              alignItems: "end",
              marginBottom: "0.7rem",
            }}
          >
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor={`player_name_${i}`}>ชื่อ–สกุล คนที่ {i + 1}</label>
              <input id={`player_name_${i}`} name={`player_name_${i}`} type="text" maxLength={80} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor={`player_ign_${i}`}>ชื่อในเกม (IGN)</label>
              <input id={`player_ign_${i}`} name={`player_ign_${i}`} type="text" maxLength={60} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor={`player_role_${i}`}>ตำแหน่ง</label>
              <input id={`player_role_${i}`} name={`player_role_${i}`} type="text" maxLength={40} />
            </div>
            <label className="checkline" style={{ paddingBottom: "0.6rem" }}>
              <input type="checkbox" name={`player_sub_${i}`} />
              สำรอง
            </label>
          </div>
        ))}

        {rows < MAX_ROWS && (
          <button
            type="button"
            className="btn btn-ink btn-sm"
            onClick={() => setRows((n) => Math.min(MAX_ROWS, n + 1))}
          >
            + เพิ่มช่องรายชื่อ
          </button>
        )}
      </div>

      <div className="panel">
        <h2>ข้อมูลเพิ่มเติม</h2>
        <div className="field">
          <label htmlFor="note">หมายเหตุถึงฝ่ายจัดการแข่งขัน</label>
          <textarea id="note" name="note" maxLength={500} />
        </div>
        <label className="checkline">
          <input type="checkbox" name="accept" />
          ข้าพเจ้าได้อ่านและยอมรับระเบียบการแข่งขันทุกข้อ
        </label>
        {err.accept && <span className="hint" style={{ color: "var(--red)" }}>{err.accept}</span>}
      </div>

      <SubmitButton />
    </form>
  );
}
