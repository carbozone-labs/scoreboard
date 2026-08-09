import { useEffect, useRef, useState } from 'react';
import { fmtNum } from '../lib/helpers';
import { timeParts } from '../lib/helpers';
import { PROGRAM_DEADLINE } from '../lib/data';
import badge from '../assets/badge.webp';
import banner from '../assets/hero-banner.webp';

export default function Hero({
  cohorts,
  activeCohortId,
  onSelectCohort,
  onUpload,
  uploading,
  dashboard,
  onCopyReport,
  onPrint,
  onDownloadPdf,
  onDownloadCsv,
  onWeeklyRollup,
  exporting,
}) {
  const fileRef = useRef(null);
  const [countdown, setCountdown] = useState(timeParts(PROGRAM_DEADLINE));

  useEffect(() => {
    const t = setInterval(() => setCountdown(timeParts(PROGRAM_DEADLINE)), 1000);
    return () => clearInterval(t);
  }, []);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onUpload(files);
    e.target.value = '';
  };

  return (
    <header className="panel hero animate-in" id="capture-hero" style={{ backgroundImage: `linear-gradient(180deg, rgba(8,11,18,0.78), rgba(8,11,18,0.94)), url(${banner})` }}>
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-top">
        <div className="hero-brand">
          <img src={badge} alt="GCAF badge" className="hero-badge" />
          <div>
            <div className="eyebrow"><span className="live-dot" /> Live cohort tracking</div>
            <h1 className="hero-title">GCAF Cohort Scoreboard</h1>
          </div>
        </div>
        <div className="hero-controls">
          {cohorts.length > 1 && (
            <select value={activeCohortId} onChange={(e) => onSelectCohort(e.target.value)} aria-label="Select cohort">
              {cohorts.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          )}
          <button className="btn btn-primary" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? (
              <span className="btn-spinner-row"><span className="btn-spinner" /> Parsing CSV…</span>
            ) : (
              '⬆ Upload CSV'
            )}
          </button>
          <input ref={fileRef} type="file" accept=".csv" multiple hidden onChange={handleFiles} disabled={uploading} />
        </div>
      </div>

      <div className="hero-mid">
        <div>
          <div className="eyebrow">Participants tracked</div>
          <div className="hero-number">{dashboard ? fmtNum(dashboard.total) : '—'}</div>
          {dashboard && (
            <div className="hero-sub">
              {fmtNum(dashboard.redeemed)} redeemed · {fmtNum(dashboard.active)} active · {fmtNum(dashboard.aiVerified)} AI-verified
            </div>
          )}
        </div>

        <div className="countdown">
          <div className="eyebrow">Time until deadline</div>
          <div className="countdown-grid">
            <div><span>{countdown.days}</span><small>days</small></div>
            <div><span>{String(countdown.hours).padStart(2, '0')}</span><small>hrs</small></div>
            <div><span>{String(countdown.minutes).padStart(2, '0')}</span><small>min</small></div>
            <div><span>{String(countdown.seconds).padStart(2, '0')}</span><small>sec</small></div>
          </div>
        </div>
      </div>

      <div className="hero-actions">
        <button className="btn" onClick={onCopyReport} disabled={!dashboard}>📋 Copy report</button>
        <button className="btn" onClick={onPrint} disabled={!dashboard}>🖨 Print summary</button>
        <button className="btn" onClick={onDownloadPdf} disabled={!dashboard || exporting}>⬇ Download PDF</button>
        <button className="btn" onClick={onDownloadCsv} disabled={!dashboard}>📄 Export roster CSV</button>
        <button className="btn" onClick={onWeeklyRollup} disabled={cohorts.length === 0 || exporting}>📊 Weekly rollup PDF</button>
      </div>
    </header>
  );
}
