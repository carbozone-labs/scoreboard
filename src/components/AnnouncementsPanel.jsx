import { useMemo, useState } from 'react';
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

  const template = COMMON_ANNOUNCEMENTS.find((t) => t.id === templateId);

  const recipients = useMemo(
    () => filterAudience(participants, audienceId).filter((p) => p.email),
    [participants, audienceId]
  );

  const subject = fillShared(template.subject, settings);
  const body = fillShared(template.body, settings);

  const handleSend = () => {
    if (recipients.length === 0) {
      showToast('No participants with an email match this audience.', 'info');
      return;
    }
    const emails = recipients.map((p) => p.email);
    window.location.href = mailtoBulkLink(emails, subject, body);
    showToast(`Mail client opened — ${emails.length} recipient(s) in BCC.`, 'success');
  };

  const handleCopyEmails = async () => {
    const emails = recipients.map((p) => p.email).join(', ');
    if (!emails) {
      showToast('No participants with an email match this audience.', 'info');
      return;
    }
    try {
      await navigator.clipboard.writeText(emails);
      showToast('Email list copied — paste into BCC of your mail client.', 'success');
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

      <div className="announcement-preview">
        <div className="announcement-preview-subject">{subject}</div>
        <pre className="announcement-preview-body">{body}</pre>
      </div>

      <div className="announcement-footer">
        <span className="eyebrow">{fmtNum(recipients.length)} recipient(s) in BCC · CC always includes facilitators</span>
        <div className="announcement-actions">
          <button className="btn" onClick={handleCopyEmails}>📋 Copy email list</button>
          <button className="btn btn-primary" onClick={handleSend}>✉ Send announcement</button>
        </div>
      </div>
    </section>
  );
}
