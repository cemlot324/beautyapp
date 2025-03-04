import { CronJob } from 'cron';

export function scheduleNotifications() {
  // Schedule for 12 PM GMT
  new CronJob('0 12 * * *', async () => {
    try {
      await fetch('/api/notifications', { method: 'POST' });
    } catch (error) {
      console.error('Failed to send scheduled notification:', error);
    }
  }, null, true, 'GMT');

  // Schedule for 6 PM GMT
  new CronJob('0 18 * * *', async () => {
    try {
      await fetch('/api/notifications', { method: 'POST' });
    } catch (error) {
      console.error('Failed to send scheduled notification:', error);
    }
  }, null, true, 'GMT');
} 