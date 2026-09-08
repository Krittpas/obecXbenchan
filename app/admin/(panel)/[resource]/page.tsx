import { notFound } from "next/navigation";

import ResourceEditor from "@/components/admin/ResourceEditor";
import { RESOURCES, getResource } from "@/lib/admin-schema";
import { createAdminSupabase } from "@/lib/supabase/admin";
import type { Team } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ resource: string }>;
  searchParams: Promise<{ saved?: string; deleted?: string }>;
};

export function generateStaticParams() {
  return RESOURCES.map((r) => ({ resource: r.key }));
}

export default async function AdminResourcePage({ params, searchParams }: Props) {
  const [{ resource: key }, flags] = await Promise.all([params, searchParams]);
  const resource = getResource(key);
  if (!resource) notFound();

  const db = createAdminSupabase();

  if (!db) {
    return (
      <>
        <h1 style={{ fontFamily: "var(--display)", fontWeight: 400, color: "var(--navy)" }}>
          {resource.title}
        </h1>
        <div className="alert alert-err" style={{ marginTop: "1rem" }}>
          ต้องตั้งค่า <code>SUPABASE_SERVICE_ROLE_KEY</code> ก่อนจึงจะแก้ไขข้อมูลได้
        </div>
      </>
    );
  }

  let query = db.from(resource.table).select("*");
  for (const order of resource.orderBy) {
    query = query.order(order.column, { ascending: order.ascending, nullsFirst: false });
  }
  const { data, error } = await query;

  const teamsResult = await db.from("teams").select("*").order("seed", { nullsFirst: false });
  const teams = ((teamsResult.data ?? []) as unknown as Team[]) ?? [];

  return (
    <>
      <h1 style={{ fontFamily: "var(--display)", fontWeight: 400, color: "var(--navy)" }}>
        {resource.title}
      </h1>
      <p className="mute" style={{ marginBottom: "1.2rem" }}>
        {resource.lead}
      </p>

      {flags.saved && (
        <div className="alert alert-ok" role="status">
          บันทึกข้อมูลเรียบร้อยแล้ว
        </div>
      )}
      {flags.deleted && (
        <div className="alert alert-ok" role="status">
          ลบรายการเรียบร้อยแล้ว
        </div>
      )}
      {error && (
        <div className="alert alert-err" role="alert">
          อ่านข้อมูลไม่สำเร็จ: {error.message} — ตรวจสอบว่ารัน migration ใน Supabase แล้วหรือยัง
        </div>
      )}

      <ResourceEditor
        resource={resource}
        rows={(data ?? []) as Record<string, unknown>[]}
        teams={teams}
      />
    </>
  );
}
