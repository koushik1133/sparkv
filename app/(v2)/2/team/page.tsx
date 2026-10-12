import type { Metadata } from "next";
import { TeamBoard } from "./team-board";
import { TEAM, TEAM_DATA_IS_SAMPLE, TEAM_DATA_UPDATED } from "@/lib/team-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Team status",
  robots: { index: false, follow: false, nocache: true },
};

export default function TeamPage() {
  return (
    <main className="team-page" id="main">
      <header className="team-head">
        <h1>Team status</h1>
        <p>
          Self-reported task status, maintained by editing <code>lib/team-data.ts</code>. Data last edited {TEAM_DATA_UPDATED}.
          This page does not track keystrokes, screens or location.
        </p>
        {TEAM_DATA_IS_SAMPLE && (
          <p className="team-sample" role="note">
            Sample data: the names, roles and tasks below are placeholders and must be replaced.
          </p>
        )}
      </header>
      <TeamBoard team={TEAM} />
    </main>
  );
}
