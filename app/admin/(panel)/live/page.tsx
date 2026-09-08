import { updateScore } from "../../actions";
import { getMatches } from "@/lib/queries";
import { thaiDateTimeShort } from "@/lib/format";
import { DIVISION_LABEL } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ saved?: string }> };

export default async function AdminLivePage({ searchParams }: Props) {
  const [{ saved }, matches] = await Promise.all([searchParams, getMatches()]);

  return (
    <>
      <h1 style={{ fontFamily: "var(--display)", fontWeight: 400, color: "var(--navy)" }}>
        คุมผลสดหน้างาน
      </h1>
      <p className="mute" style={{ marginBottom: "1.2rem" }}>
        แก้คะแนนแล้วกดบันทึก หน้าเว็บฝั่งผู้ชมจะอัปเดตทันทีผ่าน Supabase Realtime
        หากตั้งสถานะเป็น “จบแล้ว” โดยไม่เลือกผู้ชนะ ระบบจะตัดสินจากคะแนนให้เอง
      </p>

      {saved && (
        <div className="alert alert-ok" role="status">
          บันทึกผลเรียบร้อยแล้ว
        </div>
      )}

      {matches.length === 0 ? (
        <p className="empty">ยังไม่มีคู่การแข่งขัน — เพิ่มได้ที่เมนู “คู่การแข่งขัน”</p>
      ) : (
        matches.map((m) => (
          <div className="panel" key={m.id}>
            <h2>
              คู่ {m.code} · {m.division ? `${DIVISION_LABEL[m.division]} · ` : ""}
              {m.round_name}
              {m.scheduled_at ? ` · ${thaiDateTimeShort(m.scheduled_at)}` : ""}
            </h2>
            <form action={updateScore} className="inline-form">
              <input type="hidden" name="id" value={m.id} />

              <span style={{ minWidth: "12rem", fontWeight: 600 }}>
                {m.team_a?.name ?? m.label_a ?? "รอทีม"}
              </span>
              <input
                className="score-input"
                type="number"
                name="score_a"
                min={0}
                defaultValue={m.score_a ?? 0}
                aria-label={`คะแนน ${m.team_a?.name ?? "ทีม A"}`}
              />
              <span className="mute">–</span>
              <input
                className="score-input"
                type="number"
                name="score_b"
                min={0}
                defaultValue={m.score_b ?? 0}
                aria-label={`คะแนน ${m.team_b?.name ?? "ทีม B"}`}
              />
              <span style={{ minWidth: "12rem", fontWeight: 600 }}>
                {m.team_b?.name ?? m.label_b ?? "รอทีม"}
              </span>

              <select name="status" defaultValue={m.status} aria-label="สถานะ">
                <option value="wait">รอแข่ง</option>
                <option value="live">กำลังแข่ง</option>
                <option value="done">จบแล้ว</option>
              </select>

              <select name="winner" defaultValue={m.winner ?? ""} aria-label="ผู้ชนะ">
                <option value="">ตัดสินจากคะแนน</option>
                <option value="a">ทีม A ชนะ</option>
                <option value="b">ทีม B ชนะ</option>
              </select>

              <button className="btn btn-navy btn-sm" type="submit">
                บันทึก
              </button>
            </form>
          </div>
        ))
      )}
    </>
  );
}
