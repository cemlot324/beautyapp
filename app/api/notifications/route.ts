import { NextResponse } from 'next/server';
import { notificationMessages } from '@/app/config/notifications';
import webpush from 'web-push';

// Check if VAPID keys exist
if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.warn('VAPID keys are not set. Push notifications will not work.');
}

// Only set VAPID details if keys are available
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  try {
    webpush.setVapidDetails(
      'mailto:your-email@bloom.com', // Replace with your actual email
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
  } catch (error) {
    console.error('Failed to set VAPID details:', error);
  }
}

export async function POST() {
  try {
    // Check if web-push is properly configured
    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
      return NextResponse.json(
        { error: 'Push notifications are not configured' },
        { status: 501 }
      );
    }

    const randomIndex = Math.floor(Math.random() * notificationMessages.length);
    const message = notificationMessages[randomIndex];

    // Get all subscriptions from your database
    // const subscriptions = await getSubscriptionsFromDatabase();
    
    // Example subscription for testing
    const testSubscription = {
      endpoint: 'https://test-endpoint.com',
      keys: {
        p256dh: 'test-p256dh-key',
        auth: 'test-auth-key'
      }
    };

    await webpush.sendNotification(
      testSubscription,
      JSON.stringify({
        title: message.title,
        body: message.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png'
      })
    );

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('Error in notifications route:', error);
    return NextResponse.json(
      { error: 'Failed to process notification' },
      { status: 500 }
    );
  }
} 