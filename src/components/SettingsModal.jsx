import { useState } from 'react';
import { SETTINGS_FIELDS, WEEKDAYS, COMMON_ANNOUNCEMENTS } from '../lib/data';
import { notificationsSupported, notificationPermission, requestNotifyPermission } from '../lib/notify';
import { showToast } from '../lib/toast';

export default function SettingsModal({ settings, onSave, onClose }) {
  const [draft, setDraft] = useState(settings);
  const [permission, setPermission] = useState(notificationPermission());

  const update = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const handleEnableReminder = async (checked) => {
    if (checked && permission !== 'granted') {
      const result = await requestNotifyPermission();
      setPermission(result);
      if (result !== 'granted') {
        showToast('Notification permission was not granted, so the reminder can\'t fire.', 'info');
        update('weeklyReminderEnabled', false);
        return;
      }
    }
    update('weeklyReminderEnabled', checked);
  };

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

        <h2 style={{ marginTop: 24 }}>Weekly reminder notification</h2>
        <p className="empty-note">
          Get a browser notification on a chosen day each week, nudging you to send a common announcement.
          {!notificationsSupported() && ' Notifications are not supported in this browser.'}
        </p>
        <div className="settings-grid">
          <div>
            <label className="field-label">Enable weekly reminder</label>
            <label className="reminder-toggle-row">
              <input
                type="checkbox"
                checked={!!draft.weeklyReminderEnabled}
                onChange={(e) => handleEnableReminder(e.target.checked)}
                disabled={!notificationsSupported()}
              />
              <span>{draft.weeklyReminderEnabled ? 'Enabled' : 'Disabled'}</span>
            </label>
          </div>
          <div>
            <label className="field-label">Remind me on</label>
            <select value={draft.weeklyReminderDay} onChange={(e) => update('weeklyReminderDay', e.target.value)}>
              {WEEKDAYS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Announcement to nudge for</label>
            <select value={draft.weeklyReminderTemplateId} onChange={(e) => update('weeklyReminderTemplateId', e.target.value)}>
              {COMMON_ANNOUNCEMENTS.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="person-actions">
          <button className="btn btn-primary" onClick={() => { onSave(draft); onClose(); }}>Save settings</button>
        </div>
      </div>
    </div>
  );
}
