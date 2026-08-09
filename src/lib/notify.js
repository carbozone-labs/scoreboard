const LAST_SHOWN_KEY = 'gcaf_weekly_reminder_last_shown';

export function notificationsSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function notificationPermission() {
  if (!notificationsSupported()) return 'unsupported';
  return Notification.permission;
}

export async function requestNotifyPermission() {
  if (!notificationsSupported()) return 'unsupported';
  try {
    return await Notification.requestPermission();
  } catch {
    return 'denied';
  }
}

// Checks once per app load / per hour whether today matches the configured
// weekday and a reminder hasn't already been shown today, then fires a
// browser notification. Safe to call repeatedly — it self-guards on date.
export function checkWeeklyReminder(settings, templateLabel) {
  if (!settings?.weeklyReminderEnabled) return;
  if (!notificationsSupported() || Notification.permission !== 'granted') return;

  const today = new Date();
  const todayDow = String(today.getDay());
  if (todayDow !== String(settings.weeklyReminderDay)) return;

  const todayKey = today.toDateString();
  const lastShown = localStorage.getItem(LAST_SHOWN_KEY);
  if (lastShown === todayKey) return;

  try {
    new Notification('GCAF Scoreboard reminder', {
      body: `It's time to send this week's announcement: "${templateLabel}". Open the app to send it.`,
      icon: '/badge.webp',
    });
    localStorage.setItem(LAST_SHOWN_KEY, todayKey);
  } catch {
    // Notification constructor can throw in some contexts (e.g. mobile Safari); fail silently.
  }
}
