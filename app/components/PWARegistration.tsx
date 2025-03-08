'use client';

import { useEffect } from 'react';
import { register } from '../serviceWorkerRegistration';

export default function PWARegistration() {
  const showFallbackNotification = (title: string, body: string) => {
    // Create a custom notification element for iOS
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg z-50 animate-fade-in max-w-sm';
    notification.innerHTML = `
      <h4 class="font-medium mb-1">${title}</h4>
      <p class="text-sm text-gray-200">${body}</p>
    `;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('animate-fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  const registerPushNotifications = async () => {
    try {
      // Check if the browser supports notifications
      if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return;
      }

      // Check if we're on iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

      if (isIOS) {
        // Use custom notifications for iOS
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          // Store the registration for later use
          window.swRegistration = registration;
        }
      } else {
        // Regular push notification flow for other platforms
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

          // Send subscription to backend
          await fetch('/api/notifications/subscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscription),
          });
        }
      }
    } catch (error) {
      console.error('Error registering notifications:', error);
    }
  };

  useEffect(() => {
    register();
    registerPushNotifications();

    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered:', registration);
          })
          .catch((error) => {
            console.log('SW registration failed:', error);
          });
      });

      // Handle offline/online events
      window.addEventListener('online', () => {
        window.location.reload();
      });

      window.addEventListener('offline', () => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (isIOS) {
          showFallbackNotification(
            'You\'re Offline',
            'Some features may be limited while offline.'
          );
        } else if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('You\'re Offline', {
            body: 'Some features may be limited while offline.',
            icon: '/icons/icon-192x192.png'
          });
        }
      });
    }
  }, []);

  return null;
} 