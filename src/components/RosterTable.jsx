import { useEffect, useMemo, useRef, useState } from 'react';
import { fmtNum } from '../lib/helpers';

const COLUMNS = [
  { key: 'displayName', label: 'Name' },
  { key: 'redeemed', label: 'Code' },
  { key: 'skillBadges', label: 'Skill Badges' },
  { key: 'arcadeGames', label: 'Games' },
  { key: 'combined', label: 'Combined' },
  { key: 'generalMilestone', label: 'Milestone' },
];

export default function RosterTable({ participants, onSelect }) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState('combined');
  const [sortDir, setSortDir] = useState('desc');
  const searchRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === '/' && document.activeElement !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = participants;
    if (q) {
      rows = rows.filter(
        (p) => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
      );
    }
    const sorted = [...rows].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      const an = av === true ? 1 : av === false ? 0 : av || 0;
      const bn = bv === true ? 1 : bv === false ? 0 : bv || 0;
      return sortDir === 'asc' ? an - bn : bn - an;
    });
    return sorted;
  }, [participants, query, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  return (
    <section className="panel section-panel animate-in" id="capture-roster">
      <div className="section-head">
        <h2>Full roster</h2>
        <div className="roster-search">
          <input
            ref={searchRef}
            placeholder="Search name or email  ( / )"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="table-scroll scrollbar-thin">
        <table className="roster-table">
          <thead>
            <tr>
              {COLUMNS.map((c) => (
                <th key={c.key} onClick={() => toggleSort(c.key)}>
                  {c.label} {sortKey === c.key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
              ))}
              <th>Profile status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  <button className="link-name" onClick={() => onSelect(p)}>{p.displayName}</button>
                </td>
                <td>{p.redeemed ? <span className="tag tag-good">Yes</span> : <span className="tag tag-bad">No</span>}</td>
                <td>{fmtNum(p.skillBadges)}</td>
                <td>{fmtNum(p.arcadeGames)}</td>
                <td className="mono-num">{fmtNum(p.combined)}</td>
                <td>{p.generalMilestone ? <span className="tag tag-info">{p.generalMilestone}</span> : <span className="tag">None</span>}</td>
                <td>
                  {!p.skillsUrlOk && <span className="tag tag-bad">Skills URL</span>}
                  {!p.devUrlOk && <span className="tag tag-bad">Dev URL</span>}
                  {p.skillsUrlOk && p.devUrlOk && <span className="tag tag-good">OK</span>}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="empty-note">No participants match your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="roster-count eyebrow">{fmtNum(filtered.length)} of {fmtNum(participants.length)} participants shown</div>
    </section>
  );
}
