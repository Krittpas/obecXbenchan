import type { Metadata } from "next";
import LiveBoard from "@/components/LiveBoard";
import { PageHead } from "@/components/ui";
import { getMatches, getSettings } from "@/lib/queries";

export const revalidate = 15;

export const metadata: Metadata = {
  title: "ผลการแข่งขันสด",
  description: "ติดตามผลการแข่งขันแบบเรียลไทม์ อัปเดตจากโต๊ะกรรมการหน้างาน",
};

export default async function LivePage() {
  const [matches, settings] = await Promise.all([getMatches(), getSettings()]);

  return (
    <>
      <PageHead kicker="LIVE SCOREBOARD" title="ผลการแข่งขันสด" lead={settings.live_note} />
      <section>
        <div className="shell">
          <LiveBoard initial={matches} />
        </div>
      </section>
    </>
  );
}
