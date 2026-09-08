import Link from "next/link";

import Countdown from "@/components/Countdown";
import MatchCard from "@/components/MatchCard";
import ScheduleTabs from "@/components/ScheduleTabs";
import { FaqList, SectionHead, TeamCard } from "@/components/ui";
import {
  byDivision,
  getFaqs,
  getGames,
  getMatches,
  getNews,
  getSchedule,
  getSettings,
  getSponsors,
  getTeams,
} from "@/lib/queries";
import { DIVISION_LABEL, type Division } from "@/lib/types";
import { TZ, clockTime, thaiDateRange, thaiDateTimeShort } from "@/lib/format";

export const revalidate = 60;

function dayNumber(iso: string) {
  return new Intl.DateTimeFormat("th-TH", { timeZone: TZ, day: "numeric" }).format(new Date(iso));
}

function monthYear(iso: string) {
  const d = new Date(iso);
  const month = new Intl.DateTimeFormat("th-TH", { timeZone: TZ, month: "long" }).format(d);
  const year = new Intl.DateTimeFormat("th-TH-u-ca-buddhist", { timeZone: TZ, year: "numeric" }).format(d);
  return `${month} ${year.replace(/[^0-9]/g, "")}`;
}

export default async function HomePage() {
  const [settings, games, teams, matches, schedule, news, faqs, sponsors] = await Promise.all([
    getSettings(),
    getGames(),
    getTeams(),
    getMatches(),
    getSchedule(),
    getNews(3),
    getFaqs(),
    getSponsors(),
  ]);

  const startDay = dayNumber(settings.start_at);
  const endDay = dayNumber(settings.end_at);
  /* งานวันเดียวให้ขึ้นเลขวันเดียว ไม่ต้องมีขีดคั่น */
  const bigDate = startDay === endDay ? startDay : `${startDay}–${endDay}`;
  const teamsByDiv = byDivision(teams);
  const divisions: Division[] = ["junior", "senior"];
  const upcoming = matches
    .filter((m) => m.status !== "done")
    .sort((a, b) => (a.scheduled_at ?? "").localeCompare(b.scheduled_at ?? ""))
    .slice(0, 3);

  return (
    <>
      {/* ── ฮีโร่ ── */}
      <div
        className={settings.hero_image_url ? "hero has-image" : "hero"}
        id="top"
        style={
          settings.hero_image_url
            ? { backgroundImage: `url(${settings.hero_image_url})` }
            : undefined
        }
      >
        <div className="shell hero-in">
          <p className="crest">ROV TOURNAMENT 2026 · ชิงชนะเลิศแห่งจังหวัดจันทบุรี ประจำปี 2569</p>

          <h1>{settings.event_short}</h1>
          <p className="hero-sub">{settings.tagline}</p>

          <div className="datewrap">
            <div className="bigdate">{bigDate}</div>
            <div className="datemeta">
              <span className="m1">{monthYear(settings.start_at)}</span>
              <span className="m2">{settings.venue_name}</span>
              <span className="m3">
                {thaiDateRange(settings.start_at, settings.end_at)} · เวลา{" "}
                {clockTime(settings.start_at)}–{clockTime(settings.end_at)} น. · เข้าชมฟรี
              </span>
            </div>
          </div>

          <Countdown startAt={settings.start_at} endAt={settings.end_at} />

          <div className="cta">
            <Link className="btn btn-gold" href="/watch">
              รับชมการถ่ายทอดสด
            </Link>
            <Link className="btn btn-line" href="/live">
              ผลการแข่งขันสด
            </Link>
            <Link className="btn btn-line" href="/schedule">
              กำหนดการแข่งขัน
            </Link>
          </div>
        </div>
      </div>

      <div className="orgstrip">
        <div className="shell">
          {sponsors.map((s) => (
            <span key={s.id}>{s.name}</span>
          ))}
        </div>
      </div>

      {/* ── รายการที่เปิดแข่ง ── */}
      <section id="about">
        <div className="shell">
          <SectionHead
            title="รายการที่เปิดแข่ง"
            lead="แข่งขัน RoV รายการเดียว แบ่งเป็นรุ่น ม.ต้น (ม.1–ม.3) และรุ่น ม.ปลาย (ม.4–ม.6) ชิงแชมป์รุ่นละหนึ่งทีม"
          />

          <div className="grid-4" style={{ marginBottom: "1.6rem" }}>
            <div className="card fact">
              <dl>
                <dt>รูปแบบการแข่งขัน</dt>
                <dd>
                  แพ้คัดออก
                  <small>ทุกรอบ Bo3 · แพ้ตกรอบทันที</small>
                </dd>
              </dl>
            </div>
            <div className="card fact">
              <dl>
                <dt>ทีมเข้าแข่งขัน</dt>
                <dd>
                  {teams.length} ทีม
                  <small>
                    ม.ต้น {teamsByDiv.junior.length} ทีม · ม.ปลาย {teamsByDiv.senior.length} ทีม
                  </small>
                </dd>
              </dl>
            </div>
            <div className="card fact">
              <dl>
                <dt>ผู้เล่นต่อทีม</dt>
                <dd>
                  5 + 1
                  <small>ตัวจริง 5 คน สำรอง 1 คน</small>
                </dd>
              </dl>
            </div>
            <div className="card fact">
              <dl>
                <dt>รางวัลชนะเลิศ</dt>
                <dd>
                  3,000 บาท
                  <small>รุ่นละ 1 รางวัล พร้อมเกียรติบัตร</small>
                </dd>
              </dl>
            </div>
          </div>

          <div className="grid-3">
            {games.map((g) => (
              <article className="card gamecard" key={g.id}>
                <span className="n">{g.numeral}</span>
                <h3>{g.name}</h3>
                <span className="sub">{g.subtitle}</span>
                <p>
                  {g.format} · ทีมละ {g.players_per_team} คน
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── คู่ที่กำลังจะแข่ง ── */}
      {upcoming.length > 0 && (
        <section style={{ paddingTop: 0 }}>
          <div className="shell">
            <SectionHead
              title="คู่แรกที่ลงสนาม"
              lead={settings.live_note}
              action={
                <Link className="btn btn-ink" href="/live">
                  ดูผลสดทั้งหมด
                </Link>
              }
            />
            <div className="grid-3">
              {upcoming.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── กำหนดการ ── */}
      <section id="schedule" style={{ paddingTop: 0 }}>
        <div className="shell">
          <SectionHead
            title="กำหนดการ"
            lead="เวลาอาจคลาดเคลื่อนตามความเหมาะสมหน้างาน ให้ยึดประกาศของคณะกรรมการที่สนามเป็นหลัก"
            action={
              <Link className="btn btn-ink" href="/schedule">
                ดูแบบเต็ม
              </Link>
            }
          />
          <ScheduleTabs items={schedule} />
        </div>
      </section>

      {/* ── ทีม ── */}
      <section style={{ paddingTop: 0 }}>
        <div className="shell">
          <SectionHead
            title="ทีมที่เข้าแข่งขัน"
            lead="ทีมนักเรียนโรงเรียนเบญจมราชูทิศ จังหวัดจันทบุรี เรียงตามลำดับทีมวางในผังสาย"
            action={
              <Link className="btn btn-ink" href="/teams">
                ดูรายชื่อนักกีฬาทั้งหมด
              </Link>
            }
          />
          {divisions.map((division) => (
            <div key={division} style={{ marginBottom: "1.8rem" }}>
              <div className="div-head">
                <h2>{DIVISION_LABEL[division]}</h2>
                <span className="meta">{teamsByDiv[division].length} ทีม</span>
              </div>
              <div className="teams">
                {teamsByDiv[division].slice(0, 4).map((t) => (
                  <TeamCard key={t.id} team={t} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ข่าวสาร ── */}
      {news.length > 0 && (
        <section style={{ paddingTop: 0 }}>
          <div className="shell">
            <SectionHead
              title="ข่าวประชาสัมพันธ์"
              action={
                <Link className="btn btn-ink" href="/news">
                  ข่าวทั้งหมด
                </Link>
              }
            />
            {news.map((post) => (
              <Link className="newsitem" href={`/news/${post.slug}`} key={post.id}>
                <time dateTime={post.published_at}>{thaiDateTimeShort(post.published_at)}</time>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── สนามแข่ง ── */}
      <section className="venue" id="venue">
        <div className="shell">
          <SectionHead
            title="สนามแข่งขัน"
            lead="แข่งขันในสถานที่จริง ผู้สนใจเข้าชมได้ฟรีตลอดงาน"
            action={
              <Link className="btn btn-ink" href="/venue">
                ข้อมูลการเดินทาง
              </Link>
            }
          />
          <div className="grid-2">
            <div className="venue-card">
              <h3>{settings.venue_name}</h3>
              <p style={{ marginBottom: "1rem" }}>{settings.venue_address}</p>
              <ul className="vlist">
                <li>
                  <span className="k">วันแข่งขัน</span>
                  <span className="v">{thaiDateRange(settings.start_at, settings.end_at)}</span>
                </li>
                <li>
                  <span className="k">ลงทะเบียน</span>
                  <span className="v">{clockTime(settings.start_at)} น. หน้าห้องแข่งขัน</span>
                </li>
                <li>
                  <span className="k">ติดต่อสอบถาม</span>
                  <span className="v">
                    โทร. {settings.contact_phone} · LINE {settings.contact_line}
                  </span>
                </li>
              </ul>
              <a
                className="btn btn-gold"
                style={{ marginTop: "1.2rem" }}
                href={settings.venue_maps_url}
                target="_blank"
                rel="noopener"
              >
                เปิดแผนที่ Google Maps
              </a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="venue-card">
                <h3>สิ่งที่นักกีฬาต้องเตรียม</h3>
                <p>
                  บัตรประจำตัวนักเรียน อุปกรณ์ส่วนตัวที่ผ่านการตรวจจากกรรมการ
                  และมารายงานตัว ณ จุดที่กำหนดก่อนเวลาแข่งขัน 15 นาที
                </p>
              </div>
              <div className="venue-card">
                <h3>คำถามที่ถามบ่อย</h3>
                <FaqList faqs={faqs.slice(0, 3)} />
                <Link className="btn btn-ink btn-sm" style={{ marginTop: "0.8rem" }} href="/rules">
                  อ่านกติกาทั้งหมด
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
