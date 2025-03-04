'use client';

import { useEffect } from 'react';
import { register } from '../serviceWorkerRegistration';

export default function PWARegistration() {
  useEffect(() => {
    register();
    registerPushNotifications();
  }, []);

  const registerPushNotifications = async () => {
    try {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        
        // Request notification permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        // Subscribe to push notifications
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        });

        // Send subscription to your backend
        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription),
        });
      }
    } catch (error) {
      console.error('Error registering push notifications:', error);
    }
  };

  return null;
} 