import { fmtNum } from '../lib/helpers';

const TIER_NAMES = ['Milestone #1', 'Milestone #2', 'Milestone #3', 'Ultimate Milestone'];

export default function MilestonePanel({ dashboard }) {
  return (
    <section className="panel section-panel animate-in" id="capture-milestones">
      <div className="section-head">
        <h2>Cohort milestone progress</h2>
        <span className="eyebrow">Combined games + skill badges vs. tier targets</span>
      </div>
      <div className="milestone-grid">
        {dashboard.milestones.map((m, i) => {
          const target = m.games + m.badges;
          const current = Math.min(target, dashboard.totalCombined);
          const pct = Math.round((current / target) * 100);
          return (
            <div className="milestone-card" key={m.id} style={{ '--ms-color': m.color }}>
              <div className="milestone-card-head">
                <span className="milestone-card-name">{TIER_NAMES[i]}</span>
                {m.achieved && <span className="tag tag-good">✓ Achieved</span>}
              </div>
              <div className="milestone-card-pct">{pct}%</div>
              <div className="milestone-bar-outer-v2">
                <div className="milestone-bar-inner-v2" style={{ width: `${Math.min(100, pct)}%` }} />
              </div>
              <div className="milestone-footer-v2">
                <span>{fmtNum(current)}/{fmtNum(target)} completions</span>
              </div>
              {!m.achieved && (
                <div className="milestone-remaining">
                  {m.gamesRemaining > 0 && <span>{fmtNum(m.gamesRemaining)} games to go</span>}
                  {m.gamesRemaining > 0 && m.badgesRemaining > 0 && <span> · </span>}
                  {m.badgesRemaining > 0 && <span>{fmtNum(m.badgesRemaining)} badges to go</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
