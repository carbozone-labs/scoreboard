import { fmtNum, pct } from '../lib/helpers';

const STATUS_COLOR = {
  'On track': 'var(--green)',
  'Needs attention': 'var(--gold)',
  'At risk': 'var(--red)',
  'No data': 'var(--text-secondary)',
};

export default function HealthScore({ dashboard }) {
  const color = STATUS_COLOR[dashboard.healthStatus] || 'var(--text-secondary)';

  return (
    <section className="panel section-panel health-panel animate-in" style={{ '--health-color': color }}>
      <div className="health-score-block">
        <div className="health-ring" style={{ '--pct': dashboard.healthScore }}>
          <span className="health-ring-value">{dashboard.healthScore}</span>
        </div>
        <div>
          <div className="section-head" style={{ marginBottom: 4 }}>
            <h2>Cohort health</h2>
          </div>
          <span className="tag health-status-tag" style={{ color, borderColor: color }}>
            {dashboard.healthStatus}
          </span>
          <p className="empty-note small" style={{ marginTop: 8 }}>
            A snapshot score blending code redemption, active participation, AI verification,
            and average milestone progress for this upload.
          </p>
        </div>
      </div>
      <div className="health-breakdown">
        <div className="health-breakdown-item">
          <span className="health-breakdown-label">Redemption</span>
          <span className="health-breakdown-value">{pct(dashboard.redeemed, dashboard.total)}%</span>
        </div>
        <div className="health-breakdown-item">
          <span className="health-breakdown-label">Activity</span>
          <span className="health-breakdown-value">{pct(dashboard.active, dashboard.total)}%</span>
        </div>
        <div className="health-breakdown-item">
          <span className="health-breakdown-label">AI verified</span>
          <span className="health-breakdown-value">{pct(dashboard.aiVerified, dashboard.total)}%</span>
        </div>
        <div className="health-breakdown-item">
          <span className="health-breakdown-label">Open issues</span>
          <span className="health-breakdown-value">{fmtNum(dashboard.issues.length)}</span>
        </div>
      </div>
    </section>
  );
}
