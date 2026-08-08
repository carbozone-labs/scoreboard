import { fmtNum, pct } from '../lib/helpers';

function Kpi({ label, value, sub, accent, delay }) {
  return (
    <div className="panel kpi-card hover-lift animate-in" style={{ animationDelay: `${delay}ms`, '--accent': accent }}>
      <div className="eyebrow">{label}</div>
      <div className="kpi-value">{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}

export default function KpiRow({ dashboard }) {
  const d = dashboard;
  return (
    <section className="kpi-row" id="capture-kpi">
      <Kpi label="Total participants" value={fmtNum(d.total)} sub="Full cohort roster" accent="var(--cyan)" delay={0} />
      <Kpi label="Access codes redeemed" value={fmtNum(d.redeemed)} sub={`${pct(d.redeemed, d.total)}% of cohort`} accent="var(--gold)" delay={60} />
      <Kpi label="Active participants" value={fmtNum(d.active)} sub={`${pct(d.active, d.total)}% with progress`} accent="var(--green)" delay={120} />
      <Kpi label="AI-verified profiles" value={fmtNum(d.aiVerified)} sub={`${pct(d.aiVerified, d.total)}% verified`} accent="var(--violet)" delay={180} />
      <Kpi
        label="Skill badges + games"
        value={`${fmtNum(d.totalSkillBadges)} + ${fmtNum(d.totalArcadeGames)}`}
        sub={`${fmtNum(d.totalCombined)} combined completions`}
        accent="var(--cyan)"
        delay={240}
      />
    </section>
  );
}
