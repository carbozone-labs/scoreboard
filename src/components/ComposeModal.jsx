import { useEffect, useState } from 'react';
import { EMAIL_TEMPLATES } from '../lib/data';
import { buildEmailBody, fillShared, mailtoLink, firstName } from '../lib/helpers';
import { reminderReason as computeReminderReason } from '../lib/compute';

export default function ComposeModal({ person, initialTemplateId, settings, onClose, onSent }) {
  const [templateId, setTemplateId] = useState(initialTemplateId || EMAIL_TEMPLATES[0].id);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!person) return;
    const tpl = EMAIL_TEMPLATES.find((t) => t.id === templateId) || EMAIL_TEMPLATES[0];
    const gamesRemaining = Math.max(0, 12 - person.arcadeGames);
    const badgesRemaining = Math.max(0, 66 - person.skillBadges);
    const personMap = {
      'First Name': firstName(person.name),
      'Full Name': person.displayName,
      'Issue Reason': computeReminderReason(person),
      'Games Completed': String(person.arcadeGames),
      'Skill Badges Completed': String(person.skillBadges),
      'Games Remaining': String(gamesRemaining),
      'Skill Badges Remaining': String(badgesRemaining),
    };
    setSubject(fillShared(tpl.subject, settings));
    setBody(buildEmailBody(tpl.body, settings, personMap));
    setPending(false);
  }, [person, templateId, settings]);

  if (!person) return null;

  const send = () => {
    setPending(true);
    window.location.href = mailtoLink(person.email, subject, body);
    onSent(person.id);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="panel modal-card compose-card" onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-icon modal-close" onClick={onClose} aria-label="Close">✕</button>
        <h2>Compose email</h2>
        <p className="person-email">To: {person.displayName} &lt;{person.email}&gt;</p>

        <label className="field-label">Template</label>
        <select value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
          {EMAIL_TEMPLATES.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>

        <label className="field-label">Subject</label>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} />

        <label className="field-label">Body</label>
        <textarea
          className="compose-textarea scrollbar-thin"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={14}
        />

        <div className="person-actions">
          <button className="btn btn-primary" onClick={send}>
            {pending ? 'Opening mail client…' : '✉ Open in mail client'}
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
