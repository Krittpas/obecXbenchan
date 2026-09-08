import type { Metadata } from "next";
import Link from "next/link";

import MatchCard from "@/components/MatchCard";
import { PageHead, SectionHead } from "@/components/ui";
import { getMatches, getSchedule, getSettings } from "@/lib/queries";
import { streamPlatform, toEmbedUrl } from "@/lib/stream";
import { SITE_URL } from "@/lib/supabase/env";
import { clockTime, thaiDateRange } from "@/lib/format";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "รับชมการถ่ายทอดสด",
  description: "รับชมการถ่ายทอดสดการแข่งขัน RoV พร้อมผลการแข่งขันที่อัปเดตแบบเรียลไทม์",
};

function siteHost() {
  try {
    return new URL(SITE_URL).hostname;
  } catch {
    return "localhost";
  }
}

export default async function WatchPage() {
  const [settings, matches, schedule] = await Promise.all([
    getSettings(),
    getMatches(),
    getSchedule(),
  ]);

  const embed = toEmbedUrl(settings.stream_url, siteHost());
  const live = matches.filter((m) => m.status === "live");
  const nextUp = schedule.slice(0, 4);

  return (
    <>
      <PageHead
        kicker="LIVE STREAM"
        title="รับชมการถ่ายทอดสด"
        lead={
          settings.stream_live
            ? `กำลังถ่ายทอดสดทาง ${streamPlatform(settings.stream_url)}`
            : "ช่องทางรับชมการแข่งขันสดจากหอประชุมชินวรประทานวิทยาสิทธิ์"
        }
      />

      <section>
        <div className="shell">
          {settings.stream_live && (
            <div className="row" style={{ marginBottom: "1.2rem" }}>
              <span className="pill pill-live">
                <span className="pulse" style={{ background: "currentColor" }} aria-hidden="true" />
                กำลังถ่ายทอดสด
              </span>
              <span className="mute" style={{ fontSize: 13.5 }}>
                {streamPlatform(settings.stream_url)}
              </span>
            </div>
          )}

          {embed ? (
            <>
              <div className="stream-frame">
                <iframe
                  src={embed}
                  title="ถ่ายทอดสดการแข่งขัน"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="row" style={{ marginTop: "1rem" }}>
                <a className="btn btn-ink btn-sm" href={settings.stream_url} target="_blank" rel="noopener">
                  เปิดใน {streamPlatform(settings.stream_url)}
                </a>
                <Link className="btn btn-ink btn-sm" href="/live">
                  ดูผลสดทุกคู่
                </Link>
              </div>
            </>
          ) : (
            <div className="alert alert-info">
              <b>ยังไม่มีการถ่ายทอดสดในขณะนี้</b>
              <p style={{ marginTop: "0.4rem" }}>
                {settings.stream_note ||
                  "ฝ่ายจัดการแข่งขันจะประกาศลิงก์ถ่ายทอดสดผ่านหน้านี้เมื่อถึงเวลาแข่งขัน ระหว่างนี้ติดตามผลการแข่งขันได้ที่หน้าผลสด"}
              </p>
              <div className="row" style={{ marginTop: "0.8rem" }}>
                <Link className="btn btn-navy btn-sm" href="/live">
                  ดูผลการแข่งขันสด
                </Link>
                <Link className="btn btn-ink btn-sm" href="/schedule">
                  กำหนดการแข่งขัน
                </Link>
              </div>
            </div>
          )}

          {settings.stream_note && embed && (
            <p className="note" style={{ marginTop: "1.2rem" }}>
              {settings.stream_note}
            </p>
          )}
        </div>
      </section>

      {live.length > 0 && (
        <section style={{ paddingTop: 0 }}>
          <div className="shell">
            <SectionHead
              title="คู่ที่กำลังแข่งขัน"
              lead={settings.live_note}
              action={
                <Link className="btn btn-ink" href="/live">
                  ดูผลสดทั้งหมด
                </Link>
              }
            />
            <div className="grid-3">
              {live.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{ paddingTop: live.length > 0 ? 0 : undefined }}>
        <div className="shell">
          <SectionHead
            title="ช่วงเวลาถ่ายทอดสด"
            lead={`ถ่ายทอดตามกำหนดการแข่งขัน ${thaiDateRange(settings.start_at, settings.end_at)} เวลา ${clockTime(settings.start_at)}–${clockTime(settings.end_at)} น.`}
            action={
              <Link className="btn btn-ink" href="/schedule">
                กำหนดการเต็ม
              </Link>
            }
          />
          {nextUp.length === 0 ? (
            <p className="empty">ยังไม่มีกำหนดการ</p>
          ) : (
            <div className="tablewrap">
              <table className="data">
                <thead>
                  <tr>
                    <th scope="col">เวลา</th>
                    <th scope="col">รายการ</th>
                    <th scope="col">หมายเหตุ</th>
                  </tr>
                </thead>
                <tbody>
                  {nextUp.map((row) => (
                    <tr key={row.id} className={row.tag ? `is-${row.tag}` : undefined}>
                      <td className="time">{row.time}</td>
                      <td>{row.title}</td>
                      <td className="mute">{row.note ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
