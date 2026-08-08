import { fmtNum } from '../lib/helpers';

export default function PrintView({ dashboard, cohortLabel }) {
  if (!dashboard) return null;
  return (
    <div className="print-view">
      <h1>GCAF Cohort Scoreboard — {cohortLabel}</h1>
      <p>Generated {new Date().toLocaleString()}</p>
      <h2>Summary</h2>
      <table>
        <tbody>
          <tr><td>Total participants</td><td>{fmtNum(dashboard.total)}</td></tr>
          <tr><td>Access codes redeemed</td><td>{fmtNum(dashboard.redeemed)}</td></tr>
          <tr><td>Active participants</td><td>{fmtNum(dashboard.active)}</td></tr>
          <tr><td>AI-verified profiles</td><td>{fmtNum(dashboard.aiVerified)}</td></tr>
          <tr><td>Total skill badges</td><td>{fmtNum(dashboard.totalSkillBadges)}</td></tr>
          <tr><td>Total arcade games</td><td>{fmtNum(dashboard.totalArcadeGames)}</td></tr>
          <tr><td>Open issues</td><td>{fmtNum(dashboard.issues.length)}</td></tr>
          <tr><td>Zero progress</td><td>{fmtNum(dashboard.zeroProgress.length)}</td></tr>
        </tbody>
      </table>
      <h2>Top 10 leaderboard</h2>
      <table>
        <thead><tr><th>#</th><th>Name</th><th>Combined</th></tr></thead>
        <tbody>
          {dashboard.leaderboard.slice(0, 10).map((p) => (
            <tr key={p.id}><td>{p.rank}</td><td>{p.displayName}</td><td>{fmtNum(p.combined)}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
