import { fmtNum } from '../lib/helpers';

export default function ZeroProgressPanel({ zeroProgress, onSelect }) {
  return (
    <section className="panel section-panel animate-in">
      <div className="section-head">
        <h2>Zero progress</h2>
        <span className="eyebrow">{fmtNum(zeroProgress.length)} not started</span>
      </div>
      <div className="issue-list scrollbar-thin">
        {zeroProgress.map((p) => (
          <button className="issue-row" key={p.id} onClick={() => onSelect(p)}>
            <span className="issue-name">{p.displayName}</span>
            <span className="tag tag-warn">0 badges Â· 0 games Â· code unredeemed</span>
          </button>
        ))}
        {zeroProgress.length === 0 && <p className="empty-note">Everyone has made some progress ðŸŽ‰</p>}
      </div>
    </section>
  );
}

