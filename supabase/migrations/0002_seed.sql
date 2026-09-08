-- ============================================================
--  ข้อมูลตั้งต้น — รันหลัง 0001_init.sql
--  รันซ้ำได้ ไม่สร้างข้อมูลซ้ำ (ใช้ on conflict do update)
-- ============================================================

-- ── ตั้งค่างาน ──────────────────────────────────────────────
insert into public.settings (
  id, event_name, event_short, tagline, start_at, end_at,
  venue_name, venue_address, venue_maps_url,
  register_open, register_deadline, live_note,
  contact_line, contact_phone, contact_facebook
) values (
  1,
  'OBEC × BENCHAMA ESPORTS CHAMPIONSHIP 2569',
  'OBEC × BENCHAMA ESPORTS',
  'เวทีอีสปอร์ตนักเรียนระดับภูมิภาค คัดตัวแทนสู่เวทีระดับชาติ',
  '2026-09-09T08:30:00+07:00',
  '2026-09-10T17:00:00+07:00',
  'หอประชุมเบญจมราชูทิศ โรงเรียนเบญจมราชูทิศ จังหวัดจันทบุรี',
  'ถนนศรียานุสรณ์ ตำบลวัดใหม่ อำเภอเมืองจันทบุรี จังหวัดจันทบุรี 22000',
  'https://www.google.com/maps/search/?api=1&query=%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B9%80%E0%B8%9A%E0%B8%8D%E0%B8%88%E0%B8%A1%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%B9%E0%B8%97%E0%B8%B4%E0%B8%A8+%E0%B8%88%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5',
  true,
  '2026-09-05T23:59:00+07:00',
  'ผลการแข่งขันอัปเดตสดจากโต๊ะกรรมการหน้างาน',
  '@benchama-esports',
  '039-311-170',
  'https://www.facebook.com/'
)
on conflict (id) do update set
  event_name = excluded.event_name,
  event_short = excluded.event_short,
  tagline = excluded.tagline,
  start_at = excluded.start_at,
  end_at = excluded.end_at,
  venue_name = excluded.venue_name,
  venue_address = excluded.venue_address,
  venue_maps_url = excluded.venue_maps_url,
  live_note = excluded.live_note,
  contact_line = excluded.contact_line,
  contact_phone = excluded.contact_phone,
  contact_facebook = excluded.contact_facebook;

-- ── รายการที่เปิดแข่ง ───────────────────────────────────────
insert into public.games (slug, name, subtitle, format, players_per_team, numeral, sort) values
  ('rov', 'RoV', 'Arena of Valor', 'แพ้คัดออก · Bo3 · รอบชิงชนะเลิศ Bo5', '5 + 1', '๑', 1),
  ('freefire', 'Free Fire', 'Battle Royale', 'เก็บคะแนนสะสม 6 แมตช์', '4 + 1', '๒', 2),
  ('efootball', 'eFootball', 'ประเภทเดี่ยว', 'เหย้า–เยือน ตัดสินด้วยผลรวมประตู', '1', '๓', 3)
on conflict (slug) do update set
  name = excluded.name,
  subtitle = excluded.subtitle,
  format = excluded.format,
  players_per_team = excluded.players_per_team,
  numeral = excluded.numeral,
  sort = excluded.sort;

-- ── ทีม ─────────────────────────────────────────────────────
insert into public.teams (slug, name, school, district, seed, color, note, status) values
  ('benchama-dragons', 'BENCHAMA DRAGONS', 'โรงเรียนเบญจมราชูทิศ จังหวัดจันทบุรี', 'เมืองจันทบุรี', 1, '#22429E', 'เจ้าภาพ', 'approved'),
  ('sriyanu-phoenix', 'SRIYANU PHOENIX', 'โรงเรียนศรียานุสรณ์', 'เมืองจันทบุรี', 2, '#C0322A', null, 'approved'),
  ('thamai-titans', 'THA MAI TITANS', 'โรงเรียนท่าใหม่พูลสวัสดิ์ราษฎร์นุกูล', 'ท่าใหม่', 3, '#1E7A52', null, 'approved'),
  ('khlung-kraken', 'KHLUNG KRAKEN', 'โรงเรียนขลุงรัชดาภิเษก', 'ขลุง', 4, '#0D5C73', null, 'approved'),
  ('laemsing-storm', 'LAEM SING STORM', 'โรงเรียนแหลมสิงห์วิทยาคม', 'แหลมสิงห์', 5, '#6B3FA0', null, 'approved'),
  ('makham-rangers', 'MAKHAM RANGERS', 'โรงเรียนมะขามสรรเสริญ', 'มะขาม', 6, '#B4841B', null, 'approved'),
  ('soidao-wolves', 'SOI DAO WOLVES', 'โรงเรียนสอยดาววิทยา', 'สอยดาว', 7, '#3B4A63', null, 'approved'),
  ('kaenghangmaeo-bulls', 'KAENG HANG MAEO BULLS', 'โรงเรียนแก่งหางแมวพิทยาคาร', 'แก่งหางแมว', 8, '#8A3B12', null, 'approved')
on conflict (slug) do update set
  name = excluded.name,
  school = excluded.school,
  district = excluded.district,
  seed = excluded.seed,
  color = excluded.color,
  note = excluded.note;

-- ── คู่การแข่งขัน ───────────────────────────────────────────
create unique index if not exists matches_code_key on public.matches (code);

insert into public.matches (
  code, game_slug, round_name, round_order, slot,
  team_a_id, team_b_id, score_a, score_b, best_of, status, winner, scheduled_at
)
select
  v.code, 'rov', v.round_name, v.round_order, v.slot,
  ta.id, tb.id, v.score_a, v.score_b, v.best_of, v.status, v.winner, v.scheduled_at
from (values
  ('QF1', 'รอบแปดทีมสุดท้าย', 1, 1, 'benchama-dragons', 'kaenghangmaeo-bulls', 2, 0, 3, 'done', 'a', '2026-09-09T09:30:00+07:00'::timestamptz),
  ('QF2', 'รอบแปดทีมสุดท้าย', 1, 2, 'thamai-titans', 'soidao-wolves', 1, 2, 3, 'done', 'b', '2026-09-09T10:30:00+07:00'::timestamptz),
  ('QF3', 'รอบแปดทีมสุดท้าย', 1, 3, 'khlung-kraken', 'makham-rangers', 1, 1, 3, 'live', null, '2026-09-09T11:30:00+07:00'::timestamptz),
  ('QF4', 'รอบแปดทีมสุดท้าย', 1, 4, 'laemsing-storm', 'sriyanu-phoenix', null, null, 3, 'wait', null, '2026-09-09T13:00:00+07:00'::timestamptz),
  ('SF1', 'รอบรองชนะเลิศ', 2, 1, 'benchama-dragons', 'soidao-wolves', null, null, 3, 'wait', null, '2026-09-10T10:00:00+07:00'::timestamptz),
  ('SF2', 'รอบรองชนะเลิศ', 2, 2, null, null, null, null, 3, 'wait', null, '2026-09-10T11:30:00+07:00'::timestamptz),
  ('3RD', 'ชิงอันดับที่ 3', 3, 1, null, null, null, null, 3, 'wait', null, '2026-09-10T13:00:00+07:00'::timestamptz),
  ('F', 'รอบชิงชนะเลิศ', 4, 1, null, null, null, null, 5, 'wait', null, '2026-09-10T14:00:00+07:00'::timestamptz)
) as v(code, round_name, round_order, slot, slug_a, slug_b, score_a, score_b, best_of, status, winner, scheduled_at)
left join public.teams ta on ta.slug = v.slug_a
left join public.teams tb on tb.slug = v.slug_b
on conflict (code) do update set
  round_name = excluded.round_name,
  round_order = excluded.round_order,
  slot = excluded.slot,
  team_a_id = excluded.team_a_id,
  team_b_id = excluded.team_b_id,
  best_of = excluded.best_of,
  scheduled_at = excluded.scheduled_at;

-- ── กำหนดการ ────────────────────────────────────────────────
delete from public.schedule_items;
insert into public.schedule_items (day, day_title, time, title, note, tag, sort) values
  ('2026-09-09', 'วันพุธที่ 9 กันยายน 2569 — รอบคัดเลือกถึงรอบแปดทีมสุดท้าย', '08:30', 'ลงทะเบียนนักกีฬาและตรวจรายชื่อ', 'นำบัตรประจำตัวนักเรียนมาแสดง', 'open', 1),
  ('2026-09-09', 'วันพุธที่ 9 กันยายน 2569 — รอบคัดเลือกถึงรอบแปดทีมสุดท้าย', '09:00', 'พิธีเปิดการแข่งขันและชี้แจงกติกา', 'ผู้จัดการทีมทุกทีมเข้าร่วม', null, 2),
  ('2026-09-09', 'วันพุธที่ 9 กันยายน 2569 — รอบคัดเลือกถึงรอบแปดทีมสุดท้าย', '09:30', 'รอบแปดทีมสุดท้าย คู่ที่ 1–2', 'Bo3', null, 3),
  ('2026-09-09', 'วันพุธที่ 9 กันยายน 2569 — รอบคัดเลือกถึงรอบแปดทีมสุดท้าย', '11:30', 'รอบแปดทีมสุดท้าย คู่ที่ 3', 'Bo3', null, 4),
  ('2026-09-09', 'วันพุธที่ 9 กันยายน 2569 — รอบคัดเลือกถึงรอบแปดทีมสุดท้าย', '12:00', 'พักกลางวัน', null, null, 5),
  ('2026-09-09', 'วันพุธที่ 9 กันยายน 2569 — รอบคัดเลือกถึงรอบแปดทีมสุดท้าย', '13:00', 'รอบแปดทีมสุดท้าย คู่ที่ 4', 'Bo3', null, 6),
  ('2026-09-09', 'วันพุธที่ 9 กันยายน 2569 — รอบคัดเลือกถึงรอบแปดทีมสุดท้าย', '15:00', 'ประกาศคู่รอบรองชนะเลิศ', 'ประกาศหน้าห้องแข่งขันและบนเว็บไซต์', null, 7),
  ('2026-09-10', 'วันพฤหัสบดีที่ 10 กันยายน 2569 — รอบรองชนะเลิศถึงรอบชิงชนะเลิศ', '09:00', 'รายงานตัวนักกีฬา', 'ทีมที่เข้ารอบทุกทีม', 'open', 1),
  ('2026-09-10', 'วันพฤหัสบดีที่ 10 กันยายน 2569 — รอบรองชนะเลิศถึงรอบชิงชนะเลิศ', '10:00', 'รอบรองชนะเลิศ คู่ที่ 1', 'Bo3', null, 2),
  ('2026-09-10', 'วันพฤหัสบดีที่ 10 กันยายน 2569 — รอบรองชนะเลิศถึงรอบชิงชนะเลิศ', '11:30', 'รอบรองชนะเลิศ คู่ที่ 2', 'Bo3', null, 3),
  ('2026-09-10', 'วันพฤหัสบดีที่ 10 กันยายน 2569 — รอบรองชนะเลิศถึงรอบชิงชนะเลิศ', '13:00', 'ชิงอันดับที่ 3', 'Bo3', null, 4),
  ('2026-09-10', 'วันพฤหัสบดีที่ 10 กันยายน 2569 — รอบรองชนะเลิศถึงรอบชิงชนะเลิศ', '14:00', 'รอบชิงชนะเลิศ', 'Bo5', 'key', 5),
  ('2026-09-10', 'วันพฤหัสบดีที่ 10 กันยายน 2569 — รอบรองชนะเลิศถึงรอบชิงชนะเลิศ', '16:00', 'พิธีมอบรางวัลและปิดการแข่งขัน', null, null, 6);

-- ── กติกา ───────────────────────────────────────────────────
delete from public.rules;
insert into public.rules (heading, body, sort) values
  ('คุณสมบัติผู้เข้าแข่งขัน', 'เป็นนักเรียนที่กำลังศึกษาอยู่ในสถานศึกษาสังกัด สพฐ. ลงแข่งได้ทีมเดียวตลอดรายการ และต้องมีหนังสือรับรองจากสถานศึกษา', 1),
  ('การรายงานตัว', 'มาถึงจุดแข่งก่อนเวลาอย่างน้อย 30 นาที หากเกินเวลาเริ่มแมตช์ 15 นาทีถือว่าสละสิทธิ์', 2),
  ('อุปกรณ์การแข่งขัน', 'ใช้อุปกรณ์ที่ฝ่ายจัดเตรียมให้เป็นหลัก อุปกรณ์ส่วนตัวเช่นหูฟังหรือจอยควบคุมต้องผ่านการตรวจจากกรรมการก่อนใช้งาน', 3),
  ('บัญชีผู้เล่น', 'ใช้บัญชีของตนเองเท่านั้น ห้ามยืมหรือสวมสิทธิ์บัญชีผู้อื่น หากตรวจพบถือว่าปรับแพ้ทั้งทีม', 4),
  ('มารยาทในการแข่งขัน', 'ห้ามใช้ถ้อยคำหยาบคายหรือกระทำการรบกวนคู่แข่ง กรรมการมีสิทธิ์ตักเตือนและตัดสินให้ปรับแพ้', 5),
  ('การประท้วง', 'ยื่นประท้วงต่อกรรมการภายใน 15 นาทีหลังจบแมตช์พร้อมหลักฐาน คำตัดสินของกรรมการถือเป็นที่สิ้นสุด', 6);

-- ── คำถามที่ถามบ่อย ─────────────────────────────────────────
delete from public.faqs;
insert into public.faqs (question, answer, sort) values
  ('ผู้ชมทั่วไปเข้าชมได้ไหม', 'เข้าชมได้ฟรีทั้งสองวัน ไม่ต้องลงทะเบียนล่วงหน้า ขอความร่วมมืองดส่งเสียงรบกวนขณะแข่งขัน', 1),
  ('สมัครแข่งขันได้ที่ไหน', 'กรอกใบสมัครออนไลน์ได้ที่หน้าสมัครแข่งขันของเว็บไซต์นี้ ระบบจะส่งเรื่องถึงฝ่ายจัดการแข่งขันทันที', 2),
  ('เปลี่ยนตัวผู้เล่นกลางรายการได้ไหม', 'เปลี่ยนได้เฉพาะผู้เล่นสำรองที่แจ้งชื่อไว้ตอนสมัคร และต้องแจ้งกรรมการก่อนเริ่มแมตช์', 3),
  ('มีถ่ายทอดสดหรือไม่', 'ผลการแข่งขันอัปเดตสดบนหน้าผลสดของเว็บไซต์ ส่วนภาพการแข่งขันรับชมได้ที่สนามจริง', 4),
  ('ต้องเตรียมเอกสารอะไรบ้าง', 'บัตรประจำตัวนักเรียนหรือบัตรประชาชน และหนังสือรับรองสถานภาพนักเรียนจากโรงเรียนต้นสังกัด', 5);

-- ── ผู้สนับสนุน ─────────────────────────────────────────────
delete from public.sponsors;
insert into public.sponsors (name, tier, sort) values
  ('สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.)', 'host', 1),
  ('โรงเรียนเบญจมราชูทิศ จังหวัดจันทบุรี', 'host', 2),
  ('สำนักงานเขตพื้นที่การศึกษามัธยมศึกษาจันทบุรี ตราด', 'main', 3),
  ('การกีฬาแห่งประเทศไทย (กกท.)', 'main', 4),
  ('กองทุนพัฒนาการกีฬาแห่งชาติ (NSDF)', 'support', 5);

-- ── ข่าว ────────────────────────────────────────────────────
insert into public.news (slug, title, excerpt, body, published, pinned, published_at) values
  (
    'prakat-phon-chap-salak',
    'ประกาศผลการจับสลากแบ่งสายรอบแปดทีมสุดท้าย',
    'จับสลากต่อหน้าผู้จัดการทีมครบทุกทีมเมื่อวันที่ 5 กันยายน 2569 พร้อมประกาศคู่และเวลาแข่งขันอย่างเป็นทางการ',
    E'คณะกรรมการจัดการแข่งขันได้ดำเนินการจับสลากแบ่งสายการแข่งขันรอบแปดทีมสุดท้าย ต่อหน้าผู้จัดการทีมครบทุกทีม ณ ห้องประชุมโรงเรียนเบญจมราชูทิศ จังหวัดจันทบุรี\n\nผลการจับสลากปรากฏตามสายการแข่งขันบนหน้าเว็บไซต์ ทุกทีมสามารถตรวจสอบคู่แข่งขันและเวลาลงสนามได้ที่หน้าสายการแข่งขัน\n\nขอให้ทุกทีมมารายงานตัวก่อนเวลาแข่งขันอย่างน้อย 30 นาที',
    true, true, '2026-09-05T10:00:00+07:00'
  ),
  (
    'rabiap-kan-khaengkhan',
    'เผยแพร่ระเบียบการแข่งขันฉบับสมบูรณ์',
    'ระเบียบว่าด้วยคุณสมบัติผู้เข้าแข่งขัน การรายงานตัว อุปกรณ์ และการประท้วง มีผลบังคับใช้ตลอดรายการ',
    E'ฝ่ายจัดการแข่งขันได้เผยแพร่ระเบียบการแข่งขันฉบับสมบูรณ์ ครอบคลุมคุณสมบัติผู้เข้าแข่งขัน ขั้นตอนการรายงานตัว ข้อกำหนดด้านอุปกรณ์ และกระบวนการยื่นประท้วง\n\nผู้จัดการทีมทุกทีมมีหน้าที่ชี้แจงระเบียบให้นักกีฬาในสังกัดรับทราบก่อนวันแข่งขัน',
    true, false, '2026-09-01T09:00:00+07:00'
  ),
  (
    'poet-rap-samak-2569',
    'เปิดรับสมัครทีมเข้าร่วมการแข่งขัน ประจำปี 2569',
    'โรงเรียนในสังกัด สพฐ. ส่งทีมเข้าร่วมได้โรงเรียนละ 1 ทีมต่อรายการ ไม่มีค่าสมัคร',
    E'เปิดรับสมัครทีมนักเรียนเข้าร่วมการแข่งขันกีฬาอีสปอร์ต OBEC × BENCHAMA ESPORTS CHAMPIONSHIP 2569 โดยไม่มีค่าใช้จ่ายในการสมัคร\n\nสมัครออนไลน์ผ่านหน้าเว็บไซต์ กรอกรายชื่อนักกีฬาให้ครบถ้วนพร้อมข้อมูลผู้จัดการทีม ฝ่ายจัดการแข่งขันจะติดต่อกลับเพื่อยืนยันสิทธิ์ภายใน 3 วันทำการ',
    true, false, '2026-08-20T09:00:00+07:00'
  )
on conflict (slug) do nothing;
