import { fmtNum } from '../lib/helpers';

export default function IssuesPanel({ issues, onSelect }) {
  return (
    <section className="panel section-panel animate-in">
      <div className="section-head">
        <h2>Issues to resolve</h2>
        <span className="eyebrow">{fmtNum(issues.length)} flagged</span>
      </div>
      <div className="issue-list scrollbar-thin">
        {issues.map((p) => (
          <button className="issue-row" key={p.id} onClick={() => onSelect(p)}>
            <span className="issue-name">{p.displayName}</span>
            <span className="issue-tags">
              {!p.redeemed && <span className="tag tag-bad">Code unredeemed</span>}
              {!p.skillsUrlOk && <span className="tag tag-bad">Skills URL</span>}
              {!p.devUrlOk && <span className="tag tag-bad">Dev URL</span>}
            </span>
          </button>
        ))}
        {issues.length === 0 && <p className="empty-note">No open issues â€” nice and clean ðŸŽ‰</p>}
      </div>
    </section>
  );
}

