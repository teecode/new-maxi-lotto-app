import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Bell } from 'lucide-react';
import useAuthStore from '../store/authStore';

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
      
      // Check if already subscribed
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((sub) => {
          setSubscription(sub);
        });
      });
    }
  }, []);

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Request permission if not already granted
      if (Notification.permission === 'default') {
        const perm = await Notification.requestPermission();
        setPermission(perm);
        if (perm !== 'granted') return;
      }

      const publicVapidKey = 'BGvj-Zh9pfncTH6GQA1Vap73ptpEw1xhWkOR4lsrpVeYCH8QAfd2oV8iuWcPf2g0t1f3XRamjGbDf1RXRyjvxiI';
      const applicationServerKey = urlB64ToUint8Array(publicVapidKey); 
      
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
      
      setSubscription(sub);
      setPermission(Notification.permission);
      
      console.log('Push subscription:', JSON.stringify(sub));
      const minimalUser = useAuthStore.getState().minimalUser;
      if (minimalUser?.customerId) {
         import('../services/AuthService').then(({ updatePushSubscription }) => {
             updatePushSubscription(minimalUser.customerId, JSON.stringify(sub));
         });
      }
    } catch (error) {
      console.error('Failed to subscribe to push notifications', error);
      setPermission(Notification.permission);
    }
  };

  if (!isSupported) {
    return null;
  }

  if (permission === 'denied') {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
        Notifications blocked. Please enable them in your browser settings.
      </div>
    );
  }

  if (subscription) {
    return (
      <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm flex items-center gap-2">
        <Bell className="w-4 h-4" />
        Notifications enabled!
      </div>
    );
  }

  return (
    <Button onClick={subscribeToPush} variant="outline" className="w-full flex gap-2">
      <Bell className="w-4 h-4" />
      Enable Push Notifications
    </Button>
  );
}

// Utility function to convert VAPID key
function urlB64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
