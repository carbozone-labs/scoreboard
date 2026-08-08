import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { fmtNum, initials } from '../lib/helpers';

export default function PersonModal({ person, history, onClose, onCompose }) {
  if (!person) return null;

  const hasChartData = history && history.length > 1;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="panel modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-icon modal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="person-head">
          <div className="person-avatar">{initials(person.name)}</div>
          <div>
            <h2>{person.displayName}</h2>
            <p className="person-email">{person.email}</p>
          </div>
        </div>

        <div className="person-stats">
          <div><span>{fmtNum(person.skillBadges)}</span><small>Skill badges</small></div>
          <div><span>{fmtNum(person.arcadeGames)}</span><small>Arcade games</small></div>
          <div><span>{fmtNum(person.combined)}</span><small>Combined</small></div>
          <div><span>{fmtNum(person.gearCount)}</span><small>GEAR badges</small></div>
        </div>

        <div className="person-tags">
          <span className={`tag ${person.redeemed ? 'tag-good' : 'tag-bad'}`}>{person.redeemed ? 'Code redeemed' : 'Code not redeemed'}</span>
          <span className={`tag ${person.skillsUrlOk ? 'tag-good' : 'tag-bad'}`}>Skills URL {person.skillsUrlOk ? 'OK' : 'issue'}</span>
          <span className={`tag ${person.devUrlOk ? 'tag-good' : 'tag-bad'}`}>Dev URL {person.devUrlOk ? 'OK' : 'issue'}</span>
          <span className={`tag ${person.aiVerified ? 'tag-good' : 'tag-warn'}`}>AI verification: {person.aiVerification || 'Unknown'}</span>
          {person.generalMilestone && <span className="tag tag-info">{person.generalMilestone}</span>}
          {person.bonusMilestone && <span className="tag tag-warn">Bonus milestone ✓</span>}
        </div>

        {hasChartData && (
          <div className="person-history">
            <div className="eyebrow">Progress history</div>
            <div className="person-chart">
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={history} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: 'var(--panel-solid)', border: '1px solid var(--panel-border-strong)', borderRadius: 10, fontSize: 12 }}
                    labelStyle={{ color: 'var(--text-secondary)' }}
                  />
                  <Line type="monotone" dataKey="combined" stroke="var(--cyan)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {!hasChartData && history && history.length > 0 && (
          <div className="person-history">
            <div className="eyebrow">Progress history</div>
            <p className="empty-note small">Upload another snapshot of this cohort to see a trend line.</p>
          </div>
        )}

        <div className="person-actions">
          <button className="btn btn-primary" onClick={() => onCompose(person)}>✉ Compose email</button>
          {person.skillsUrl && <a className="btn btn-ghost" href={person.skillsUrl} target="_blank" rel="noreferrer">Skills profile ↗</a>}
          {person.devUrl && <a className="btn btn-ghost" href={person.devUrl} target="_blank" rel="noreferrer">Developer profile ↗</a>}
        </div>
      </div>
    </div>
  );
}
