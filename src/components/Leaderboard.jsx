import { fmtNum } from '../lib/helpers';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard({ leaderboard, onSelect }) {
  const top = leaderboard.slice(0, 10);
  return (
    <section className="panel section-panel animate-in" id="capture-leaderboard">
      <div className="section-head">
        <h2>Leaderboard</h2>
        <span className="eyebrow">Ranked by combined skill badges + arcade games</span>
      </div>
      <div className="leaderboard-list">
        {top.map((p, i) => (
          <button
            className="leaderboard-row hover-lift"
            key={p.id}
            onClick={() => onSelect(p)}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <span className="lb-rank">{MEDALS[i] || `#${p.rank}`}</span>
            <span className="lb-name">{p.displayName}</span>
            <span className="lb-badges">
              {p.gearCount > 0 && <span className="tag tag-violet">GEAR ×{p.gearCount}</span>}
              {p.bonusMilestone && <span className="tag tag-warn">Bonus ✓</span>}
              {p.generalMilestone && <span className="tag tag-info">{p.generalMilestone}</span>}
            </span>
            <span className="lb-score">{fmtNum(p.combined)}</span>
          </button>
        ))}
        {top.length === 0 && <p className="empty-note">No participants to rank yet.</p>}
      </div>
    </section>
  );
}
