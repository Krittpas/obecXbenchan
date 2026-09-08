import { saveSettings } from "../../actions";
import { getSettings } from "@/lib/queries";
import { toDatetimeLocal } from "@/lib/format";
import { hasServiceRole } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ saved?: string }> };

export default async function AdminSettingsPage({ searchParams }: Props) {
  const [{ saved }, settings] = await Promise.all([searchParams, getSettings()]);

  return (
    <>
      <h1 style={{ fontFamily: "var(--display)", fontWeight: 400, color: "var(--navy)" }}>ตั้งค่างาน</h1>
      <p className="mute" style={{ marginBottom: "1.2rem" }}>
        ข้อมูลชุดนี้ใช้ทั่วทั้งเว็บไซต์ ทั้งหัวเว็บ ฮีโร่ นาฬิกานับถอยหลัง หน้าสนามแข่ง และท้ายเว็บ
      </p>

      {saved && (
        <div className="alert alert-ok" role="status">
          บันทึกการตั้งค่าเรียบร้อยแล้ว
        </div>
      )}
      {!hasServiceRole && (
        <div className="alert alert-err">
          ต้องตั้งค่า <code>SUPABASE_SERVICE_ROLE_KEY</code> ก่อนจึงจะบันทึกได้
        </div>
      )}

      <form action={saveSettings}>
        <div className="panel">
          <h2>ชื่องานและคำโปรย</h2>
          <div className="field">
            <label htmlFor="event_name">ชื่อเต็มของงาน</label>
            <input id="event_name" name="event_name" type="text" defaultValue={settings.event_name} required />
          </div>
          <div className="field">
            <label htmlFor="event_short">ชื่อย่อ (แสดงบนหัวเว็บและฮีโร่)</label>
            <input id="event_short" name="event_short" type="text" defaultValue={settings.event_short} required />
          </div>
          <div className="field">
            <label htmlFor="tagline">คำโปรย</label>
            <input id="tagline" name="tagline" type="text" defaultValue={settings.tagline} />
          </div>
          <div className="field">
            <label htmlFor="live_note">ข้อความประกอบหน้าผลสด</label>
            <input id="live_note" name="live_note" type="text" defaultValue={settings.live_note} />
          </div>
        </div>

        <div className="panel">
          <h2>ช่วงเวลาจัดงาน</h2>
          <div className="field-row">
            <div className="field">
              <label htmlFor="start_at">เริ่มงาน</label>
              <input
                id="start_at"
                name="start_at"
                type="datetime-local"
                defaultValue={toDatetimeLocal(settings.start_at)}
              />
              <span className="hint">ใช้กับนาฬิกานับถอยหลังบนหน้าแรก (เวลาไทย)</span>
            </div>
            <div className="field">
              <label htmlFor="end_at">จบงาน</label>
              <input
                id="end_at"
                name="end_at"
                type="datetime-local"
                defaultValue={toDatetimeLocal(settings.end_at)}
              />
            </div>
          </div>
        </div>

        <div className="panel">
          <h2>รูปภาพประจำงาน</h2>
          <div className="field">
            <label htmlFor="logo_url">ลิงก์โลโก้งาน</label>
            <input id="logo_url" name="logo_url" type="url" defaultValue={settings.logo_url} />
            <span className="hint">แสดงบนหัวเว็บแทนสัญลักษณ์หกเหลี่ยม แนะนำภาพจัตุรัส ประมาณ 200×200 px</span>
          </div>
          <div className="field">
            <label htmlFor="hero_image_url">ลิงก์ภาพพื้นหลังหน้าแรก</label>
            <input
              id="hero_image_url"
              name="hero_image_url"
              type="url"
              defaultValue={settings.hero_image_url}
            />
            <span className="hint">
              ภาพแนวนอนขนาดใหญ่ ประมาณ 1920×1080 px ระบบจะคลุมด้วยเลเยอร์สีกรมให้อ่านตัวหนังสือได้
            </span>
          </div>
        </div>

        <div className="panel">
          <h2>การถ่ายทอดสด</h2>
          <label className="checkline" style={{ marginBottom: "0.9rem" }}>
            <input type="checkbox" name="stream_live" defaultChecked={settings.stream_live} />
            กำลังถ่ายทอดสดอยู่ขณะนี้
          </label>
          <div className="field">
            <label htmlFor="stream_url">ลิงก์ถ่ายทอดสด</label>
            <input id="stream_url" name="stream_url" type="url" defaultValue={settings.stream_url} />
            <span className="hint">
              วางลิงก์ YouTube, Facebook Live หรือ Twitch ได้เลย ระบบจะแปลงเป็นวิดีโอฝังให้อัตโนมัติ
            </span>
          </div>
          <div className="field">
            <label htmlFor="stream_note">ข้อความประกอบหน้าถ่ายทอดสด</label>
            <input id="stream_note" name="stream_note" type="text" defaultValue={settings.stream_note} />
            <span className="hint">แสดงใต้วิดีโอ หรือแสดงแทนเมื่อยังไม่มีลิงก์ถ่ายทอดสด</span>
          </div>
        </div>

        <div className="panel">
          <h2>สนามแข่งขันและการติดต่อ</h2>
          <div className="field">
            <label htmlFor="venue_name">ชื่อสนามแข่งขัน</label>
            <input id="venue_name" name="venue_name" type="text" defaultValue={settings.venue_name} />
          </div>
          <div className="field">
            <label htmlFor="venue_address">ที่อยู่</label>
            <input id="venue_address" name="venue_address" type="text" defaultValue={settings.venue_address} />
          </div>
          <div className="field">
            <label htmlFor="venue_maps_url">ลิงก์ Google Maps</label>
            <input id="venue_maps_url" name="venue_maps_url" type="url" defaultValue={settings.venue_maps_url} />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="contact_phone">เบอร์ติดต่อ</label>
              <input id="contact_phone" name="contact_phone" type="text" defaultValue={settings.contact_phone} />
            </div>
            <div className="field">
              <label htmlFor="contact_line">LINE</label>
              <input id="contact_line" name="contact_line" type="text" defaultValue={settings.contact_line} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="contact_facebook">ลิงก์เพจ Facebook</label>
            <input
              id="contact_facebook"
              name="contact_facebook"
              type="url"
              defaultValue={settings.contact_facebook}
            />
          </div>
        </div>

        <button className="btn btn-navy" type="submit">
          บันทึกการตั้งค่า
        </button>
      </form>
    </>
  );
}
