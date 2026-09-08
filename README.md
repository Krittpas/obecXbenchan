# OBEC × BENCHAN ESPORTS 2569

เว็บไซต์ทางการของการแข่งขัน **RoV** ภายในโรงเรียนเบญจมราชูทิศ จังหวัดจันทบุรี
แข่งขัน ณ **หอประชุมชินวรประทานวิทยาสิทธิ์** แบ่งเป็น **รุ่น ม.ต้น 16 ทีม** และ **รุ่น ม.ปลาย 13 ทีม**

สร้างด้วย **Next.js 16 (App Router) + TypeScript + Supabase** พร้อม deploy บน **Vercel**

จุดสำคัญ: **เว็บทำงานได้ทันทีแม้ยังไม่ได้ตั้งค่า Supabase** โดยจะอ่านข้อมูลจริงชุดเดียวกันจาก `lib/fallback.ts`
เมื่อใส่ environment variables ครบแล้ว ทุกหน้าจะสลับไปดึงจากฐานข้อมูลโดยอัตโนมัติ

---

## สิ่งที่เว็บนี้ทำได้

### ฝั่งผู้ชม
| หน้า | ความสามารถ |
|---|---|
| `/` | ฮีโร่ + นาฬิกานับถอยหลัง + รายการแข่ง + คู่ที่กำลังจะถึง + กำหนดการ + ทีม + ข่าว + สนามแข่ง |
| `/live` | **ผลสดแบบเรียลไทม์** ผ่าน Supabase Realtime (มี polling สำรองทุก 30 วินาที) |
| `/bracket` | ผังสายแพ้คัดออก **แยกสองรุ่น** เลื่อนแนวนอนได้ พร้อมลิงก์ไปผังต้นฉบับบน Challonge |
| `/schedule` | กำหนดการแบบแท็บรายวัน |
| `/teams`, `/teams/[slug]` | รายชื่อทีมแยกรุ่น + รายชื่อนักกีฬาพร้อมระดับชั้น + ครูผู้ควบคุม + โปรแกรมของทีม |
| `/standings` | ตารางอันดับแยกรุ่น คำนวณอัตโนมัติจากผลแมตช์ |
| `/news`, `/news/[slug]` | ข่าวประชาสัมพันธ์ |
| `/gallery` | ภาพบรรยากาศ |
| `/rules` | กติกา + คำถามที่ถามบ่อย |
| `/venue` | สนามแข่งขัน การเดินทาง และช่องทางติดต่อ |
| `/register` | **ใบสมัครออนไลน์** บันทึกลง Supabase มีกันบอทและตรวจข้อมูลฝั่งเซิร์ฟเวอร์ |

รวมถึง SEO ครบชุด: `sitemap.xml`, `robots.txt`, OpenGraph image, PWA manifest, และรองรับหน้าจอมือถือ/การพิมพ์

### ฝั่งเจ้าหน้าที่ (`/admin`)
- เข้าสู่ระบบด้วย Supabase Auth และต้องมี `user_id` อยู่ในตาราง `admins`
- **คุมผลสดหน้างาน** — แก้คะแนน/สถานะแล้วหน้าผู้ชมอัปเดตทันที (ถ้าตั้งเป็น “จบแล้ว” โดยไม่เลือกผู้ชนะ ระบบตัดสินจากคะแนนให้)
- **ตรวจใบสมัคร** — กดรับรองแล้วสร้างทีมพร้อมรายชื่อนักกีฬาให้อัตโนมัติ
- **แก้ไขได้ทุกตาราง** — คู่แข่งขัน, ทีม, นักกีฬา, กำหนดการ, ข่าว, ภาพ, รายการแข่ง, กติกา, FAQ, ผู้สนับสนุน
- **ตั้งค่างาน** — ชื่องาน วันเวลา สนาม ช่องทางติดต่อ เปิด/ปิดรับสมัคร

---

## ขั้นตอนติดตั้ง

### 1. ติดตั้งและรันในเครื่อง

```bash
npm install
cp .env.example .env.local   # แล้วแก้ค่าตามข้อ 2
npm run dev                  # http://localhost:3000
```

### 2. ตั้งค่า Supabase

1. สร้างโปรเจกต์ที่ [supabase.com](https://supabase.com)
2. ไปที่ **SQL Editor** แล้วรันไฟล์ตามลำดับ (รันซ้ำได้ทั้งสองไฟล์)
   - `supabase/migrations/0001_init.sql` — ตาราง, คอลัมน์รุ่น/ครู/ระดับชั้น, RLS, Realtime
   - `supabase/migrations/0002_real_data.sql` — ข้อมูลจริง 33 ทีม พร้อมรายชื่อนักกีฬาและผังสายทั้งสองรุ่น
3. ไปที่ **Project Settings → API** แล้วคัดลอกค่าลง `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."
NEXT_PUBLIC_SITE_URL="https://ชื่อโปรเจกต์.vercel.app"
REVALIDATE_SECRET="สุ่มข้อความยาว ๆ"
```

> `SUPABASE_SERVICE_ROLE_KEY` ใช้ฝั่งเซิร์ฟเวอร์เท่านั้น **ห้าม**ใส่ `NEXT_PUBLIC_` นำหน้าเด็ดขาด

### 3. สร้างบัญชีผู้ดูแล

1. Supabase → **Authentication → Users → Add user** (ใส่อีเมลและรหัสผ่าน, ติ๊ก auto confirm)
2. คัดลอก `User UID` แล้วรันใน SQL Editor

```sql
insert into public.admins (user_id, email)
values ('วาง-user-uid-ที่นี่', 'อีเมลผู้ดูแล');
```

3. เข้าสู่ระบบที่ `/admin/login`

### 4. Deploy บน Vercel

```bash
git init
git add .
git commit -m "OBEC x BENCHAN Esports website"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

จากนั้นที่ [vercel.com/new](https://vercel.com/new) → Import repo → ใส่ Environment Variables ทั้ง 5 ตัวข้างบน → Deploy
(ตั้ง region เป็น `sin1` ให้แล้วใน `vercel.json` เพื่อความเร็วในไทย)

หลัง deploy ครั้งแรก อย่าลืมแก้ `NEXT_PUBLIC_SITE_URL` ให้เป็นโดเมนจริงแล้ว redeploy

---

## การอัปเดตข้อมูลระหว่างงาน

หน้าเว็บใช้ ISR (cache 15–60 วินาทีแล้วแต่หน้า) และล้าง cache ให้อัตโนมัติทุกครั้งที่บันทึกจากแผงผู้ดูแล
หน้า `/live` ไม่ต้องรอ cache เพราะรับข้อมูลผ่าน Supabase Realtime โดยตรง

ถ้าแก้ข้อมูลจาก Supabase Dashboard โดยตรง สามารถสั่งล้าง cache ได้ที่

```bash
curl -X POST "https://โดเมนของคุณ/api/revalidate?secret=REVALIDATE_SECRET"
```

หรือผูกกับ **Database Webhooks** ของ Supabase ให้ยิงอัตโนมัติเมื่อข้อมูลเปลี่ยน

---

## โครงสร้างโปรเจกต์

```
app/
  page.tsx                    หน้าแรก
  live|bracket|schedule|...   หน้าสาธารณะ
  register/                   ใบสมัคร + server action
  admin/
    login/                    หน้าเข้าสู่ระบบ
    (panel)/                  แผงผู้ดูแล (ต้องล็อกอิน)
      [resource]/             ตัวแก้ไข CRUD อัตโนมัติตาม lib/admin-schema.ts
    actions.ts                server actions ทั้งหมดของฝั่งผู้ดูแล
  api/revalidate/             ล้าง cache จากภายนอก
components/                   UI ที่ใช้ซ้ำ
lib/
  types.ts                    ชนิดข้อมูลตรงกับตารางใน Supabase
  queries.ts                  ตัวอ่านข้อมูล (มี fallback ในตัว)
  fallback.ts                 ข้อมูลจริงชุดสำรอง ใช้เมื่อยังไม่ต่อฐานข้อมูล
  admin-schema.ts             นิยามฟอร์มและ whitelist ตารางของแผงผู้ดูแล
  auth.ts                     ตรวจสิทธิ์ผู้ดูแล
supabase/migrations/          SQL สำหรับสร้างฐานข้อมูล
legacy/index.html             เว็บเวอร์ชันไฟล์เดียวเดิม เก็บไว้อ้างอิง
```

## ที่มาของข้อมูล

| ข้อมูล | แหล่งที่มา |
|---|---|
| รายชื่อทีมและนักกีฬา 33 ทีม | Google Sheet ใบสมัคร (ดึงเมื่อจัดทำเว็บ) |
| ผังสาย ม.ต้น 16 ทีม | https://challonge.com/brtyw1pu |
| ผังสาย ม.ปลาย 13 ทีม | https://challonge.com/qny8pazw |

ข้อมูลถูกแปลงเป็น `lib/fallback.ts` และ `supabase/migrations/0002_real_data.sql`
หากผังสายหรือรายชื่อเปลี่ยน ให้แก้ผ่านแผงผู้ดูแลที่ `/admin` ซึ่งเป็นแหล่งข้อมูลจริงหลังต่อ Supabase แล้ว

**หมายเหตุด้านข้อมูลส่วนบุคคล** — เว็บแสดงเฉพาะชื่อทีม ชื่อนักกีฬา ระดับชั้น และชื่อครูผู้ควบคุม
ไม่แสดงอีเมลและเบอร์โทรศัพท์ที่อยู่ในใบสมัคร

## คำสั่งที่ใช้บ่อย

```bash
npm run dev        # โหมดพัฒนา
npm run build      # build สำหรับ production
npm run start      # รัน production ในเครื่อง
npm run typecheck  # ตรวจ TypeScript
```
