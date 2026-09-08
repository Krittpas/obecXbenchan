/* ข้อมูลตัวอย่าง — ใช้แสดงผลเมื่อยังไม่ได้ตั้งค่า Supabase
   เนื้อหาชุดเดียวกันนี้ถูก seed ลงฐานข้อมูลใน supabase/migrations/0002_seed.sql */
import type {
  Faq,
  GalleryItem,
  Game,
  Match,
  NewsPost,
  Rule,
  ScheduleItem,
  Settings,
  Sponsor,
  Team,
} from "./types";

export const fallbackSettings: Settings = {
  event_name: "OBEC × BENCHAMA ESPORTS CHAMPIONSHIP 2569",
  event_short: "OBEC × BENCHAMA ESPORTS",
  tagline: "เวทีอีสปอร์ตนักเรียนระดับภูมิภาค คัดตัวแทนสู่เวทีระดับชาติ",
  start_at: "2026-09-09T08:30:00+07:00",
  end_at: "2026-09-10T17:00:00+07:00",
  venue_name: "หอประชุมเบญจมราชูทิศ โรงเรียนเบญจมราชูทิศ จังหวัดจันทบุรี",
  venue_address: "ถนนศรียานุสรณ์ ตำบลวัดใหม่ อำเภอเมืองจันทบุรี จังหวัดจันทบุรี 22000",
  venue_maps_url:
    "https://www.google.com/maps/search/?api=1&query=%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B9%80%E0%B8%9A%E0%B8%8D%E0%B8%88%E0%B8%A1%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%B9%E0%B8%97%E0%B8%B4%E0%B8%A8+%E0%B8%88%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5",
  register_open: true,
  register_deadline: "2026-09-05T23:59:00+07:00",
  live_note: "ผลการแข่งขันอัปเดตสดจากโต๊ะกรรมการหน้างาน",
  contact_line: "@benchama-esports",
  contact_phone: "039-311-170",
  contact_facebook: "https://www.facebook.com/",
};

export const fallbackGames: Game[] = [
  {
    id: "g1",
    slug: "rov",
    name: "RoV",
    subtitle: "Arena of Valor",
    format: "แพ้คัดออก · Bo3 · รอบชิงชนะเลิศ Bo5",
    players_per_team: "5 + 1",
    numeral: "๑",
    sort: 1,
  },
  {
    id: "g2",
    slug: "freefire",
    name: "Free Fire",
    subtitle: "Battle Royale",
    format: "เก็บคะแนนสะสม 6 แมตช์",
    players_per_team: "4 + 1",
    numeral: "๒",
    sort: 2,
  },
  {
    id: "g3",
    slug: "efootball",
    name: "eFootball",
    subtitle: "ประเภทเดี่ยว",
    format: "เหย้า–เยือน ตัดสินด้วยผลรวมประตู",
    players_per_team: "1",
    numeral: "๓",
    sort: 3,
  },
];

function team(
  n: number,
  slug: string,
  name: string,
  school: string,
  district: string,
  color: string,
  note = "",
): Team {
  return {
    id: `t${n}`,
    slug,
    name,
    school,
    district,
    seed: n,
    logo_url: null,
    note: note || null,
    status: "approved",
    color,
  };
}

export const fallbackTeams: Team[] = [
  team(1, "benchama-dragons", "BENCHAMA DRAGONS", "โรงเรียนเบญจมราชูทิศ จังหวัดจันทบุรี", "เมืองจันทบุรี", "#22429E", "เจ้าภาพ"),
  team(2, "sriyanu-phoenix", "SRIYANU PHOENIX", "โรงเรียนศรียานุสรณ์", "เมืองจันทบุรี", "#C0322A"),
  team(3, "thamai-titans", "THA MAI TITANS", "โรงเรียนท่าใหม่พูลสวัสดิ์ราษฎร์นุกูล", "ท่าใหม่", "#1E7A52"),
  team(4, "khlung-kraken", "KHLUNG KRAKEN", "โรงเรียนขลุงรัชดาภิเษก", "ขลุง", "#0D5C73"),
  team(5, "laemsing-storm", "LAEM SING STORM", "โรงเรียนแหลมสิงห์วิทยาคม", "แหลมสิงห์", "#6B3FA0"),
  team(6, "makham-rangers", "MAKHAM RANGERS", "โรงเรียนมะขามสรรเสริญ", "มะขาม", "#B4841B"),
  team(7, "soidao-wolves", "SOI DAO WOLVES", "โรงเรียนสอยดาววิทยา", "สอยดาว", "#3B4A63"),
  team(8, "kaenghangmaeo-bulls", "KAENG HANG MAEO BULLS", "โรงเรียนแก่งหางแมวพิทยาคาร", "แก่งหางแมว", "#8A3B12"),
];

const teamById = Object.fromEntries(fallbackTeams.map((x) => [x.id, x]));

function match(
  code: string,
  roundName: string,
  roundOrder: number,
  slot: number,
  a: string | null,
  b: string | null,
  scoreA: number | null,
  scoreB: number | null,
  status: Match["status"],
  winner: Match["winner"],
  scheduledAt: string,
  bestOf = 3,
): Match {
  return {
    id: code,
    code,
    game_slug: "rov",
    round_name: roundName,
    round_order: roundOrder,
    slot,
    team_a_id: a,
    team_b_id: b,
    score_a: scoreA,
    score_b: scoreB,
    best_of: bestOf,
    status,
    winner,
    scheduled_at: scheduledAt,
    note: null,
    team_a: a ? teamById[a] : null,
    team_b: b ? teamById[b] : null,
  };
}

export const fallbackMatches: Match[] = [
  match("QF1", "รอบแปดทีมสุดท้าย", 1, 1, "t1", "t8", 2, 0, "done", "a", "2026-09-09T09:30:00+07:00"),
  match("QF2", "รอบแปดทีมสุดท้าย", 1, 2, "t3", "t7", 1, 2, "done", "b", "2026-09-09T10:30:00+07:00"),
  match("QF3", "รอบแปดทีมสุดท้าย", 1, 3, "t4", "t6", 1, 1, "live", null, "2026-09-09T11:30:00+07:00"),
  match("QF4", "รอบแปดทีมสุดท้าย", 1, 4, "t5", "t2", null, null, "wait", null, "2026-09-09T13:00:00+07:00"),
  match("SF1", "รอบรองชนะเลิศ", 2, 1, "t1", "t7", null, null, "wait", null, "2026-09-10T10:00:00+07:00"),
  match("SF2", "รอบรองชนะเลิศ", 2, 2, null, null, null, null, "wait", null, "2026-09-10T11:30:00+07:00"),
  match("3RD", "ชิงอันดับที่ 3", 3, 1, null, null, null, null, "wait", null, "2026-09-10T13:00:00+07:00"),
  match("F", "รอบชิงชนะเลิศ", 4, 1, null, null, null, null, "wait", null, "2026-09-10T14:00:00+07:00", 5),
];

const DAY1 = "2026-09-09";
const DAY2 = "2026-09-10";
const DAY1_TITLE = "วันพุธที่ 9 กันยายน 2569 — รอบคัดเลือกถึงรอบแปดทีมสุดท้าย";
const DAY2_TITLE = "วันพฤหัสบดีที่ 10 กันยายน 2569 — รอบรองชนะเลิศถึงรอบชิงชนะเลิศ";

function slot(
  id: string,
  day: string,
  dayTitle: string,
  time: string,
  title: string,
  note: string,
  tag: ScheduleItem["tag"],
  sort: number,
): ScheduleItem {
  return { id, day, day_title: dayTitle, time, title, note: note || null, tag, sort };
}

export const fallbackSchedule: ScheduleItem[] = [
  slot("s1", DAY1, DAY1_TITLE, "08:30", "ลงทะเบียนนักกีฬาและตรวจรายชื่อ", "นำบัตรประจำตัวนักเรียนมาแสดง", "open", 1),
  slot("s2", DAY1, DAY1_TITLE, "09:00", "พิธีเปิดการแข่งขันและชี้แจงกติกา", "ผู้จัดการทีมทุกทีมเข้าร่วม", null, 2),
  slot("s3", DAY1, DAY1_TITLE, "09:30", "รอบแปดทีมสุดท้าย คู่ที่ 1–2", "Bo3", null, 3),
  slot("s4", DAY1, DAY1_TITLE, "11:30", "รอบแปดทีมสุดท้าย คู่ที่ 3", "Bo3", null, 4),
  slot("s5", DAY1, DAY1_TITLE, "12:00", "พักกลางวัน", "", null, 5),
  slot("s6", DAY1, DAY1_TITLE, "13:00", "รอบแปดทีมสุดท้าย คู่ที่ 4", "Bo3", null, 6),
  slot("s7", DAY1, DAY1_TITLE, "15:00", "ประกาศคู่รอบรองชนะเลิศ", "ประกาศหน้าห้องแข่งขันและบนเว็บไซต์", null, 7),
  slot("s8", DAY2, DAY2_TITLE, "09:00", "รายงานตัวนักกีฬา", "ทีมที่เข้ารอบทุกทีม", "open", 1),
  slot("s9", DAY2, DAY2_TITLE, "10:00", "รอบรองชนะเลิศ คู่ที่ 1", "Bo3", null, 2),
  slot("s10", DAY2, DAY2_TITLE, "11:30", "รอบรองชนะเลิศ คู่ที่ 2", "Bo3", null, 3),
  slot("s11", DAY2, DAY2_TITLE, "13:00", "ชิงอันดับที่ 3", "Bo3", null, 4),
  slot("s12", DAY2, DAY2_TITLE, "14:00", "รอบชิงชนะเลิศ", "Bo5", "key", 5),
  slot("s13", DAY2, DAY2_TITLE, "16:00", "พิธีมอบรางวัลและปิดการแข่งขัน", "", null, 6),
];

export const fallbackRules: Rule[] = [
  {
    id: "r1",
    heading: "คุณสมบัติผู้เข้าแข่งขัน",
    body: "เป็นนักเรียนที่กำลังศึกษาอยู่ในสถานศึกษาสังกัด สพฐ. ลงแข่งได้ทีมเดียวตลอดรายการ และต้องมีหนังสือรับรองจากสถานศึกษา",
    sort: 1,
  },
  {
    id: "r2",
    heading: "การรายงานตัว",
    body: "มาถึงจุดแข่งก่อนเวลาอย่างน้อย 30 นาที หากเกินเวลาเริ่มแมตช์ 15 นาทีถือว่าสละสิทธิ์",
    sort: 2,
  },
  {
    id: "r3",
    heading: "อุปกรณ์การแข่งขัน",
    body: "ใช้อุปกรณ์ที่ฝ่ายจัดเตรียมให้เป็นหลัก อุปกรณ์ส่วนตัวเช่นหูฟังหรือจอยควบคุมต้องผ่านการตรวจจากกรรมการก่อนใช้งาน",
    sort: 3,
  },
  {
    id: "r4",
    heading: "บัญชีผู้เล่น",
    body: "ใช้บัญชีของตนเองเท่านั้น ห้ามยืมหรือสวมสิทธิ์บัญชีผู้อื่น หากตรวจพบถือว่าปรับแพ้ทั้งทีม",
    sort: 4,
  },
  {
    id: "r5",
    heading: "มารยาทในการแข่งขัน",
    body: "ห้ามใช้ถ้อยคำหยาบคายหรือกระทำการรบกวนคู่แข่ง กรรมการมีสิทธิ์ตักเตือนและตัดสินให้ปรับแพ้",
    sort: 5,
  },
  {
    id: "r6",
    heading: "การประท้วง",
    body: "ยื่นประท้วงต่อกรรมการภายใน 15 นาทีหลังจบแมตช์พร้อมหลักฐาน คำตัดสินของกรรมการถือเป็นที่สิ้นสุด",
    sort: 6,
  },
];

export const fallbackFaqs: Faq[] = [
  {
    id: "f1",
    question: "ผู้ชมทั่วไปเข้าชมได้ไหม",
    answer: "เข้าชมได้ฟรีทั้งสองวัน ไม่ต้องลงทะเบียนล่วงหน้า ขอความร่วมมืองดส่งเสียงรบกวนขณะแข่งขัน",
    sort: 1,
  },
  {
    id: "f2",
    question: "สมัครแข่งขันได้ที่ไหน",
    answer: "กรอกใบสมัครออนไลน์ได้ที่หน้าสมัครแข่งขันของเว็บไซต์นี้ ระบบจะส่งเรื่องถึงฝ่ายจัดการแข่งขันทันที",
    sort: 2,
  },
  {
    id: "f3",
    question: "เปลี่ยนตัวผู้เล่นกลางรายการได้ไหม",
    answer: "เปลี่ยนได้เฉพาะผู้เล่นสำรองที่แจ้งชื่อไว้ตอนสมัคร และต้องแจ้งกรรมการก่อนเริ่มแมตช์",
    sort: 3,
  },
  {
    id: "f4",
    question: "มีถ่ายทอดสดหรือไม่",
    answer: "ผลการแข่งขันอัปเดตสดบนหน้าผลสดของเว็บไซต์ ส่วนภาพการแข่งขันรับชมได้ที่สนามจริง",
    sort: 4,
  },
  {
    id: "f5",
    question: "ต้องเตรียมเอกสารอะไรบ้าง",
    answer: "บัตรประจำตัวนักเรียนหรือบัตรประชาชน และหนังสือรับรองสถานภาพนักเรียนจากโรงเรียนต้นสังกัด",
    sort: 5,
  },
];

export const fallbackNews: NewsPost[] = [
  {
    id: "n1",
    slug: "prakat-phon-chap-salak",
    title: "ประกาศผลการจับสลากแบ่งสายรอบแปดทีมสุดท้าย",
    excerpt: "จับสลากต่อหน้าผู้จัดการทีมครบทุกทีมเมื่อวันที่ 5 กันยายน 2569 พร้อมประกาศคู่และเวลาแข่งขันอย่างเป็นทางการ",
    body: "คณะกรรมการจัดการแข่งขันได้ดำเนินการจับสลากแบ่งสายการแข่งขันรอบแปดทีมสุดท้าย ต่อหน้าผู้จัดการทีมครบทุกทีม ณ ห้องประชุมโรงเรียนเบญจมราชูทิศ จังหวัดจันทบุรี\n\nผลการจับสลากปรากฏตามสายการแข่งขันบนหน้าเว็บไซต์ ทุกทีมสามารถตรวจสอบคู่แข่งขันและเวลาลงสนามได้ที่หน้าสายการแข่งขัน\n\nขอให้ทุกทีมมารายงานตัวก่อนเวลาแข่งขันอย่างน้อย 30 นาที",
    cover_url: null,
    published: true,
    pinned: true,
    published_at: "2026-09-05T10:00:00+07:00",
  },
  {
    id: "n2",
    slug: "rabiap-kan-khaengkhan",
    title: "เผยแพร่ระเบียบการแข่งขันฉบับสมบูรณ์",
    excerpt: "ระเบียบว่าด้วยคุณสมบัติผู้เข้าแข่งขัน การรายงานตัว อุปกรณ์ และการประท้วง มีผลบังคับใช้ตลอดรายการ",
    body: "ฝ่ายจัดการแข่งขันได้เผยแพร่ระเบียบการแข่งขันฉบับสมบูรณ์ ครอบคลุมคุณสมบัติผู้เข้าแข่งขัน ขั้นตอนการรายงานตัว ข้อกำหนดด้านอุปกรณ์ และกระบวนการยื่นประท้วง\n\nผู้จัดการทีมทุกทีมมีหน้าที่ชี้แจงระเบียบให้นักกีฬาในสังกัดรับทราบก่อนวันแข่งขัน",
    cover_url: null,
    published: true,
    pinned: false,
    published_at: "2026-09-01T09:00:00+07:00",
  },
  {
    id: "n3",
    slug: "poet-rap-samak-2569",
    title: "เปิดรับสมัครทีมเข้าร่วมการแข่งขัน ประจำปี 2569",
    excerpt: "โรงเรียนในสังกัด สพฐ. ส่งทีมเข้าร่วมได้โรงเรียนละ 1 ทีมต่อรายการ ไม่มีค่าสมัคร",
    body: "เปิดรับสมัครทีมนักเรียนเข้าร่วมการแข่งขันกีฬาอีสปอร์ต OBEC × BENCHAMA ESPORTS CHAMPIONSHIP 2569 โดยไม่มีค่าใช้จ่ายในการสมัคร\n\nสมัครออนไลน์ผ่านหน้าเว็บไซต์ กรอกรายชื่อนักกีฬาให้ครบถ้วนพร้อมข้อมูลผู้จัดการทีม ฝ่ายจัดการแข่งขันจะติดต่อกลับเพื่อยืนยันสิทธิ์ภายใน 3 วันทำการ",
    cover_url: null,
    published: true,
    pinned: false,
    published_at: "2026-08-20T09:00:00+07:00",
  },
];

export const fallbackGallery: GalleryItem[] = [];

export const fallbackSponsors: Sponsor[] = [
  { id: "sp1", name: "สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.)", tier: "host", logo_url: null, url: null, sort: 1 },
  { id: "sp2", name: "โรงเรียนเบญจมราชูทิศ จังหวัดจันทบุรี", tier: "host", logo_url: null, url: null, sort: 2 },
  { id: "sp3", name: "สำนักงานเขตพื้นที่การศึกษามัธยมศึกษาจันทบุรี ตราด", tier: "main", logo_url: null, url: null, sort: 3 },
  { id: "sp4", name: "การกีฬาแห่งประเทศไทย (กกท.)", tier: "main", logo_url: null, url: null, sort: 4 },
  { id: "sp5", name: "กองทุนพัฒนาการกีฬาแห่งชาติ (NSDF)", tier: "support", logo_url: null, url: null, sort: 5 },
];
