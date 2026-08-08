import { useState } from 'react';
import { SETTINGS_FIELDS } from '../lib/data';

export default function SettingsModal({ settings, onSave, onClose }) {
  const [draft, setDraft] = useState(settings);

  const update = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="panel modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-icon modal-close" onClick={onClose} aria-label="Close">✕</button>
        <h2>Email settings</h2>
        <p className="empty-note">These fill the {'{{shared}}'} placeholders in every template.</p>
        <div className="settings-grid">
          {SETTINGS_FIELDS.map(([key, label]) => (
            <div key={key}>
              <label className="field-label">{label}</label>
              <input value={draft[key] || ''} onChange={(e) => update(key, e.target.value)} />
            </div>
          ))}
        </div>
        <div className="person-actions">
          <button className="btn btn-primary" onClick={() => { onSave(draft); onClose(); }}>Save settings</button>
        </div>
      </div>
    </div>
  );
}
