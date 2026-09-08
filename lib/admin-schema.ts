/* นิยามตารางที่แก้ไขได้จากแผงผู้ดูแล
   ใช้เป็นทั้งรายการ whitelist ของ server action และตัวสร้างฟอร์มอัตโนมัติ */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "checkbox"
  | "select"
  | "datetime"
  | "date"
  | "url"
  | "team"
  | "color";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
  options?: { value: string; label: string }[];
  full?: boolean;
};

export type Resource = {
  key: string;
  table: string;
  title: string;
  singular: string;
  lead: string;
  orderBy: { column: string; ascending: boolean }[];
  fields: Field[];
  /** ใช้สร้างหัวข้อในรายการ */
  primary: string;
  secondary?: string[];
};

const DIVISION_OPTIONS = [
  { value: "", label: "— ยังไม่ระบุรุ่น —" },
  { value: "junior", label: "รุ่น ม.ต้น" },
  { value: "senior", label: "รุ่น ม.ปลาย" },
];

const STATUS_OPTIONS = [
  { value: "wait", label: "รอแข่ง" },
  { value: "live", label: "กำลังแข่ง" },
  { value: "done", label: "จบแล้ว" },
];

export const RESOURCES: Resource[] = [
  {
    key: "matches",
    table: "matches",
    title: "คู่การแข่งขัน",
    singular: "คู่แข่งขัน",
    lead: "จัดการรอบ คู่ ผลคะแนน และสถานะการแข่งขันทั้งหมด",
    orderBy: [
      { column: "division", ascending: true },
      { column: "round_order", ascending: true },
      { column: "slot", ascending: true },
    ],
    primary: "code",
    secondary: ["division", "round_name", "status"],
    fields: [
      { name: "code", label: "รหัสคู่", type: "text", required: true, hint: "เช่น QF1, SF2, F" },
      { name: "division", label: "รุ่น", type: "select", options: DIVISION_OPTIONS },
      { name: "round_name", label: "ชื่อรอบ", type: "text", required: true },
      { name: "round_order", label: "ลำดับรอบ", type: "number", required: true, hint: "1 = รอบแรกสุด" },
      { name: "slot", label: "ลำดับคู่ในรอบ", type: "number", required: true },
      { name: "game_slug", label: "รายการ", type: "text", hint: "rov" },
      { name: "team_a_id", label: "ทีม A", type: "team" },
      { name: "team_b_id", label: "ทีม B", type: "team" },
      {
        name: "label_a",
        label: "ข้อความแทนทีม A",
        type: "text",
        hint: "ใช้เมื่อยังไม่ทราบทีม เช่น ผู้ชนะคู่ J-A",
      },
      { name: "label_b", label: "ข้อความแทนทีม B", type: "text" },
      { name: "score_a", label: "คะแนน A", type: "number" },
      { name: "score_b", label: "คะแนน B", type: "number" },
      { name: "best_of", label: "Best of", type: "number" },
      { name: "status", label: "สถานะ", type: "select", options: STATUS_OPTIONS },
      {
        name: "winner",
        label: "ผู้ชนะ",
        type: "select",
        options: [
          { value: "", label: "ยังไม่ตัดสิน" },
          { value: "a", label: "ทีม A" },
          { value: "b", label: "ทีม B" },
        ],
      },
      { name: "scheduled_at", label: "เวลาแข่ง", type: "datetime" },
      { name: "note", label: "หมายเหตุ", type: "text", full: true },
    ],
  },
  {
    key: "teams",
    table: "teams",
    title: "ทีมที่เข้าแข่งขัน",
    singular: "ทีม",
    lead: "ข้อมูลทีม รุ่น ครูผู้ควบคุม ลำดับทีมวาง และสถานะการรับรอง",
    orderBy: [
      { column: "division", ascending: true },
      { column: "seed", ascending: true },
    ],
    primary: "name",
    secondary: ["division", "seed", "status"],
    fields: [
      { name: "name", label: "ชื่อทีม", type: "text", required: true },
      { name: "slug", label: "slug", type: "text", required: true, hint: "ใช้ในลิงก์ เช่น benchan-esports" },
      { name: "school", label: "สถานศึกษา", type: "text" },
      { name: "district", label: "อำเภอ / เขตพื้นที่", type: "text" },
      { name: "division", label: "รุ่น", type: "select", options: DIVISION_OPTIONS },
      { name: "teacher", label: "ครูที่ปรึกษาประจำทีม", type: "text" },
      { name: "seed", label: "ทีมวางอันดับ", type: "number" },
      { name: "color", label: "สีประจำทีม", type: "color" },
      { name: "logo_url", label: "ลิงก์โลโก้", type: "url" },
      { name: "note", label: "หมายเหตุ", type: "text" },
      {
        name: "status",
        label: "สถานะ",
        type: "select",
        options: [
          { value: "approved", label: "รับรองแล้ว" },
          { value: "pending", label: "รอตรวจสอบ" },
        ],
      },
    ],
  },
  {
    key: "players",
    table: "players",
    title: "รายชื่อนักกีฬา",
    singular: "นักกีฬา",
    lead: "รายชื่อผู้เล่นรายทีม ระบุตัวจริงและตัวสำรอง",
    orderBy: [{ column: "sort", ascending: true }],
    primary: "name",
    secondary: ["level", "ign", "role"],
    fields: [
      { name: "team_id", label: "ทีม", type: "team", required: true },
      { name: "name", label: "ชื่อ–สกุล", type: "text", required: true },
      { name: "ign", label: "ชื่อในเกม (IGN)", type: "text" },
      { name: "level", label: "ระดับชั้น", type: "text", hint: "เช่น ม.5/4" },
      { name: "role", label: "ตำแหน่ง", type: "text" },
      { name: "is_sub", label: "เป็นตัวสำรอง", type: "checkbox" },
      { name: "sort", label: "ลำดับ", type: "number" },
    ],
  },
  {
    key: "schedule",
    table: "schedule_items",
    title: "กำหนดการ",
    singular: "รายการในกำหนดการ",
    lead: "ตารางเวลารายวัน แสดงบนหน้ากำหนดการและหน้าแรก",
    orderBy: [
      { column: "day", ascending: true },
      { column: "sort", ascending: true },
    ],
    primary: "title",
    secondary: ["day", "time"],
    fields: [
      { name: "day", label: "วันที่", type: "date", required: true },
      { name: "day_title", label: "หัวข้อของวัน", type: "text", full: true },
      { name: "time", label: "เวลา", type: "text", required: true, hint: "เช่น 09:30" },
      { name: "title", label: "รายการ", type: "text", required: true, full: true },
      { name: "note", label: "หมายเหตุ", type: "text", full: true },
      {
        name: "tag",
        label: "เน้นแถว",
        type: "select",
        options: [
          { value: "", label: "ปกติ" },
          { value: "open", label: "ลงทะเบียน (เขียว)" },
          { value: "key", label: "รายการสำคัญ (ทอง)" },
        ],
      },
      { name: "sort", label: "ลำดับ", type: "number" },
    ],
  },
  {
    key: "news",
    table: "news",
    title: "ข่าวประชาสัมพันธ์",
    singular: "ข่าว",
    lead: "ประกาศจากฝ่ายจัดการแข่งขัน เผยแพร่ทันทีที่ติ๊กเผยแพร่",
    orderBy: [{ column: "published_at", ascending: false }],
    primary: "title",
    secondary: ["published_at"],
    fields: [
      { name: "title", label: "หัวข้อข่าว", type: "text", required: true, full: true },
      { name: "slug", label: "slug", type: "text", required: true },
      { name: "published_at", label: "วันที่เผยแพร่", type: "datetime" },
      { name: "excerpt", label: "สรุปย่อ", type: "textarea", full: true },
      { name: "body", label: "เนื้อหา", type: "textarea", required: true, full: true, hint: "ขึ้นย่อหน้าใหม่ด้วยการเว้นบรรทัด" },
      { name: "cover_url", label: "ลิงก์ภาพปก", type: "url", full: true },
      { name: "published", label: "เผยแพร่", type: "checkbox" },
      { name: "pinned", label: "ปักหมุด", type: "checkbox" },
    ],
  },
  {
    key: "gallery",
    table: "gallery",
    title: "ภาพบรรยากาศ",
    singular: "ภาพ",
    lead: "เพิ่มลิงก์ภาพจาก Supabase Storage หรือแหล่งอื่น",
    orderBy: [{ column: "sort", ascending: true }],
    primary: "caption",
    secondary: ["album"],
    fields: [
      { name: "url", label: "ลิงก์ภาพ", type: "url", required: true, full: true },
      { name: "caption", label: "คำบรรยาย", type: "text", full: true },
      { name: "album", label: "อัลบั้ม", type: "text" },
      { name: "sort", label: "ลำดับ", type: "number" },
    ],
  },
  {
    key: "games",
    table: "games",
    title: "รายการที่เปิดแข่ง",
    singular: "รายการแข่ง",
    lead: "ชนิดกีฬาอีสปอร์ตที่จัดแข่งขัน",
    orderBy: [{ column: "sort", ascending: true }],
    primary: "name",
    secondary: ["subtitle"],
    fields: [
      { name: "name", label: "ชื่อรายการ", type: "text", required: true },
      { name: "slug", label: "slug", type: "text", required: true },
      { name: "subtitle", label: "ชื่อรอง", type: "text" },
      { name: "numeral", label: "เลขไทย", type: "text", hint: "เช่น ๑ ๒ ๓" },
      { name: "format", label: "รูปแบบการแข่ง", type: "text", full: true },
      { name: "players_per_team", label: "ผู้เล่นต่อทีม", type: "text" },
      { name: "sort", label: "ลำดับ", type: "number" },
    ],
  },
  {
    key: "rules",
    table: "rules",
    title: "กติกา",
    singular: "ข้อกติกา",
    lead: "ระเบียบการแข่งขันที่แสดงบนหน้ากติกา",
    orderBy: [{ column: "sort", ascending: true }],
    primary: "heading",
    fields: [
      { name: "heading", label: "หัวข้อ", type: "text", required: true, full: true },
      { name: "body", label: "รายละเอียด", type: "textarea", required: true, full: true },
      { name: "sort", label: "ลำดับ", type: "number" },
    ],
  },
  {
    key: "faqs",
    table: "faqs",
    title: "คำถามที่ถามบ่อย",
    singular: "คำถาม",
    lead: "คำถาม–คำตอบที่แสดงบนหน้ากติกาและหน้าแรก",
    orderBy: [{ column: "sort", ascending: true }],
    primary: "question",
    fields: [
      { name: "question", label: "คำถาม", type: "text", required: true, full: true },
      { name: "answer", label: "คำตอบ", type: "textarea", required: true, full: true },
      { name: "sort", label: "ลำดับ", type: "number" },
    ],
  },
  {
    key: "banned-skins",
    table: "banned_skins",
    title: "สกินที่ห้ามใช้",
    singular: "สกินที่ห้ามใช้",
    lead: "รายชื่อสกินที่ห้ามใช้ในการแข่งขัน ตามระเบียบข้อ 5.6",
    orderBy: [{ column: "sort", ascending: true }],
    primary: "skin",
    secondary: ["hero"],
    fields: [
      { name: "hero", label: "ฮีโร่", type: "text", required: true },
      { name: "skin", label: "ชื่อสกิน", type: "text", required: true },
      { name: "sort", label: "ลำดับ", type: "number" },
    ],
  },
  {
    key: "penalties",
    table: "penalties",
    title: "ตารางบทลงโทษ",
    singular: "บทลงโทษ",
    lead: "ตารางสรุปบทลงโทษตามระเบียบข้อ 6.7",
    orderBy: [{ column: "sort", ascending: true }],
    primary: "offense",
    secondary: ["first_offense"],
    fields: [
      { name: "offense", label: "ประเภทความผิด", type: "textarea", required: true, full: true },
      { name: "first_offense", label: "ครั้งที่ 1", type: "text", full: true },
      { name: "second_offense", label: "ครั้งที่ 2", type: "text", full: true },
      { name: "sort", label: "ลำดับ", type: "number" },
    ],
  },
  {
    key: "prizes",
    table: "prizes",
    title: "รางวัลการแข่งขัน",
    singular: "รางวัล",
    lead: "เงินรางวัลและของรางวัลที่แสดงบนหน้ากติกา",
    orderBy: [{ column: "sort", ascending: true }],
    primary: "place",
    secondary: ["amount"],
    fields: [
      { name: "place", label: "อันดับ", type: "text", required: true, full: true },
      { name: "amount", label: "เงินรางวัล", type: "text", hint: "เช่น 3,000 บาท" },
      { name: "note", label: "รายละเอียดเพิ่มเติม", type: "text", full: true },
      { name: "sort", label: "ลำดับ", type: "number" },
    ],
  },
  {
    key: "sponsors",
    table: "sponsors",
    title: "ผู้จัดและผู้สนับสนุน",
    singular: "หน่วยงาน",
    lead: "แสดงบนแถบใต้ฮีโร่และท้ายเว็บ",
    orderBy: [{ column: "sort", ascending: true }],
    primary: "name",
    secondary: ["tier"],
    fields: [
      { name: "name", label: "ชื่อหน่วยงาน", type: "text", required: true, full: true },
      {
        name: "tier",
        label: "ระดับ",
        type: "select",
        options: [
          { value: "host", label: "เจ้าภาพ" },
          { value: "main", label: "ผู้สนับสนุนหลัก" },
          { value: "support", label: "ผู้สนับสนุน" },
        ],
      },
      { name: "logo_url", label: "ลิงก์โลโก้", type: "url" },
      { name: "url", label: "ลิงก์เว็บไซต์", type: "url" },
      { name: "sort", label: "ลำดับ", type: "number" },
    ],
  },
];

export const RESOURCE_MAP = new Map(RESOURCES.map((r) => [r.key, r]));

export function getResource(key: string): Resource | null {
  return RESOURCE_MAP.get(key) ?? null;
}
