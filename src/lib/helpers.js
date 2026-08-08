export function titleCase(str = '') {
  return str
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

export function firstName(fullName = '') {
  const parts = titleCase(fullName).split(' ').filter(Boolean);
  return parts[0] || 'there';
}

export function fmtNum(n) {
  if (n === undefined || n === null || Number.isNaN(n)) return '0';
  return n.toLocaleString('en-IN');
}

export function pct(part, total) {
  if (!total) return 0;
  return Math.min(100, Math.round((part / total) * 1000) / 10);
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function fillShared(text, settings) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => settings?.[key] ?? '');
}

export function fillPerson(text, map) {
  return text.replace(/\[\[([^\]]+)\]\]/g, (_, label) => {
    const key = label.trim();
    return map?.[key] ?? '';
  });
}

export function buildEmailBody(template, settings, personMap) {
  return fillPerson(fillShared(template, settings), personMap);
}

export const FIXED_CC = 'aniketsagarshah@gmail.com,srushtipete06@gmail.com';

export function mailtoLink(email, subject, body) {
  const params = new URLSearchParams({ subject, body, cc: FIXED_CC });
  return `mailto:${email}?${params.toString()}`.replace(/\+/g, '%20');
}

// Bulk announcement mail: recipients go in BCC (so no one sees the full list),
// the fixed CC addresses are still included, and "to" is left blank.
export function mailtoBulkLink(bccEmails, subject, body) {
  const params = new URLSearchParams({ subject, body, cc: FIXED_CC, bcc: bccEmails.join(',') });
  return `mailto:?${params.toString()}`.replace(/\+/g, '%20');
}

export function daysUntil(dateStr) {
  const now = new Date();
  const target = new Date(dateStr);
  const ms = target - now;
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function timeParts(dateStr) {
  const now = new Date().getTime();
  const target = new Date(dateStr).getTime();
  let diff = Math.max(0, target - now);
  const day = 1000 * 60 * 60 * 24;
  const days = Math.floor(diff / day);
  diff -= days * day;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * 1000 * 60 * 60;
  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * 1000 * 60;
  const seconds = Math.floor(diff / 1000);
  return { days, hours, minutes, seconds };
}

export function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function initials(fullName = '') {
  const parts = titleCase(fullName).split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0];
  return parts[0][0] + parts[parts.length - 1][0];
}

// Strips trailing date/timestamp segments from a CSV filename so the same program
// export uploaded on different days maps to the same cohort id.
export function cohortBaseId(rawName) {
  let name = rawName.replace(/\.csv$/i, '').trim();

  const sepIdx = name.indexOf('__');
  if (sepIdx >= 0) {
    name = name.slice(0, sepIdx);
  } else {
    // Strip a trailing "[DD Mon]" or "(DD Mon)" bracketed date chunk
    name = name.replace(
      /[\s_-]*[\[\(]\s*\d{1,2}[\s_-](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*[\]\)]\s*$/i,
      ''
    );
    // Or a trailing " DD Mon" / "_DD_Mon" / "-DD-Mon" without brackets
    name = name.replace(
      /[\s_-]+\d{1,2}[\s_-](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*$/i,
      ''
    );
  }

  return name.replace(/[\s_-]+$/, '').trim();
}
