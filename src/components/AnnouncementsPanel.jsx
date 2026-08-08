import { useEffect, useMemo, useState } from 'react';
import { COMMON_ANNOUNCEMENTS } from '../lib/data';
import { fillShared, mailtoBulkLink, fmtNum } from '../lib/helpers';
import { showToast } from '../lib/toast';

const AUDIENCES = [
  { id: 'all', label: 'All participants' },
  { id: 'not_redeemed', label: 'Access code not redeemed' },
  { id: 'zero_progress', label: 'Zero progress' },
];

function filterAudience(participants, audienceId) {
  if (audienceId === 'not_redeemed') return participants.filter((p) => !p.redeemed);
  if (audienceId === 'zero_progress') return participants.filter((p) => p.zeroProgress);
  return participants;
}

export default function AnnouncementsPanel({ participants, settings }) {
  const [templateId, setTemplateId] = useState(COMMON_ANNOUNCEMENTS[0].id);
  const [audienceId, setAudienceId] = useState('all');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [edited, setEdited] = useState(false);

  const template = COMMON_ANNOUNCEMENTS.find((t) => t.id === templateId);

  useEffect(() => {
    setSubject(fillShared(template.subject, settings));
    setBody(fillShared(template.body, settings));
    setEdited(false);
  }, [templateId]);

  const recipients = useMemo(
    () => filterAudience(participants, audienceId).filter((p) => p.email),
    [participants, audienceId]
  );

  const handleReset = () => {
    setSubject(fillShared(template.subject, settings));
    setBody(fillShared(template.body, settings));
    setEdited(false);
  };

  const handleSend = () => {
    if (recipients.length === 0) {
      showToast('No participants with an email match this audience.', 'info');
      return;
    }
    const emails = recipients.map((p) => p.email);
    window.location.href = mailtoBulkLink(emails, subject, body);
    showToast(`Mail client opened - ${emails.length} recipient(s) in BCC.`, 'success');
  };

  const handleCopyEmails = async () => {
    const emails = recipients.map((p) => p.email).join(', ');
    if (!emails) {
      showToast('No participants with an email match this audience.', 'info');
      return;
    }
    try {
      await navigator.clipboard.writeText(emails);
      showToast('Email list copied - paste into BCC of your mail client.', 'success');
    } catch {
      showToast('Could not copy. Please select and copy the list manually.', 'error');
    }
  };

  return (
    <section className="panel section-panel animate-in" id="capture-announcements">
      <div className="section-head">
        <h2>Common announcements</h2>
        <span className="eyebrow">One mail, whole cohort</span>
      </div>

      <div className="announcement-controls">
        <div className="announcement-field">
          <label>Announcement</label>
          <select value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
            {COMMON_ANNOUNCEMENTS.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="announcement-field">
          <label>Send to</label>
          <select value={audienceId} onChange={(e) => setAudienceId(e.target.value)}>
            {AUDIENCES.map((a) => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="announcement-field" style={{ marginBottom: 10 }}>
        <label>Subject</label>
        <input
          value={subject}
          onChange={(e) => { setSubject(e.target.value); setEdited(true); }}
        />
      </div>

      <div className="announcement-field">
        <label>Body {edited && <span style={{ color: 'var(--gold)' }}>(edited)</span>}</label>
        <textarea
          className="announcement-edit-body"
          value={body}
          onChange={(e) => { setBody(e.target.value); setEdited(true); }}
          rows={10}
        />
      </div>

      <div className="announcement-footer">
        <span className="eyebrow">{fmtNum(recipients.length)} recipient(s) in BCC - CC always includes facilitators</span>
        <div className="announcement-actions">
          {edited && <button className="btn" onClick={handleReset}>Reset to template</button>}
          <button className="btn" onClick={handleCopyEmails}>Copy email list</button>
          <button className="btn btn-primary" onClick={handleSend}>Send announcement</button>
        </div>
      </div>
    </section>
  );
}
