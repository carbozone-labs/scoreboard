import { useMemo, useState } from 'react';
import { reminderScore, reminderReason } from '../lib/compute';
import { fmtNum } from '../lib/helpers';

function suggestedTemplate(p) {
  if (!p.redeemed) return 'access_code';
  if (!p.skillsUrlOk || !p.devUrlOk) return 'wrong_url';
  if (p.zeroProgress) return 'zero_badges';
  if (p.combined > 0 && p.combined < 78) return 'almost_there';
  if (p.bonusMilestone) return 'congratulations';
  return 'ultimate_milestone';
}

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'unredeemed', label: 'Unredeemed codes' },
  { id: 'zero', label: 'Zero progress' },
  { id: 'profile', label: 'Profile issues' },
  { id: 'near', label: 'Near milestone' },
];

function matchesFilter(p, filter) {
  if (filter === 'unredeemed') return !p.redeemed;
  if (filter === 'zero') return p.zeroProgress;
  if (filter === 'profile') return !p.skillsUrlOk || !p.devUrlOk;
  if (filter === 'near') return p.combined > 0 && p.combined < 78;
  return true;
}

export default function ReminderPanel({ participants, contactLog, onToggleContacted, onCompose }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const prioritized = useMemo(() => {
    return [...participants]
      .map((p) => ({ ...p, score: reminderScore(p), reason: reminderReason(p) }))
      .sort((a, b) => b.score - a.score);
  }, [participants]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prioritized.filter((p) => {
      if (!matchesFilter(p, filter)) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [prioritized, query, filter]);

  const contactedCount = Object.values(contactLog).filter(Boolean).length;

  const markAllFiltered = (value) => {
    filtered.forEach((p) => {
      if (!!contactLog[p.id] !== value) onToggleContacted(p.id);
    });
  };

  return (
    <section className="panel section-panel animate-in" id="capture-reminders">
      <div className="section-head">
        <h2>Reminder queue</h2>
        <span className="eyebrow">{fmtNum(contactedCount)} contacted this session</span>
      </div>

      <div className="reminder-toolbar">
        <input
          placeholder="Search name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          {FILTERS.map((f) => (
            <option key={f.id} value={f.id}>{f.label}</option>
          ))}
        </select>
        <button className="btn btn-ghost" onClick={() => markAllFiltered(true)}>Mark all shown contacted</button>
        <button className="btn btn-ghost" onClick={() => markAllFiltered(false)}>Clear contacted (shown)</button>
      </div>

      <div className="reminder-count eyebrow">{fmtNum(filtered.length)} of {fmtNum(prioritized.length)} shown</div>

      <div className="reminder-list scrollbar-thin">
        {filtered.map((p) => {
          const contacted = !!contactLog[p.id];
          return (
            <div className={`reminder-row ${contacted ? 'is-contacted' : ''}`} key={p.id}>
              <div className="reminder-main">
                <span className="reminder-name">{p.displayName}</span>
                <span className="reminder-reason">{p.reason}</span>
              </div>
              <div className="reminder-meta">
                <span className="mono-num">{fmtNum(p.arcadeGames)}g / {fmtNum(p.skillBadges)}b</span>
              </div>
              <div className="reminder-actions">
                <button className="btn btn-primary" onClick={() => onCompose(p, suggestedTemplate(p))}>Compose</button>
                <label className="contacted-toggle">
                  <input type="checkbox" checked={contacted} onChange={() => onToggleContacted(p.id)} />
                  Contacted
                </label>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="empty-note">No one matches this filter right now.</p>}
      </div>
    </section>
  );
}
