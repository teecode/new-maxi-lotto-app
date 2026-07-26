import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed the prompt
    if (localStorage.getItem('pwaPromptDismissed')) {
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    
    // Detect if already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in window.navigator && (window.navigator as any).standalone);

    if (isIosDevice && !isStandalone) {
      setIsIOS(true);
      setShowPrompt(true);
    }
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Update UI notify the user they can install the PWA
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Also handle appinstalled event
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowPrompt(false);
      console.log('PWA was installed');
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    } else {
      console.log('User dismissed the A2HS prompt');
    }
    
    // We no longer need the prompt. Clear it up
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwaPromptDismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col gap-3 z-50">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Install Maxi Lotto</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isIOS ? 'Install our app for a better experience.' : 'Add our app to your home screen for a better experience.'}
          </p>
        </div>
        <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {isIOS ? (
        <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg flex flex-col gap-2">
          <p>To install this app on your iOS device:</p>
          <ol className="list-decimal pl-5 flex flex-col gap-2">
            <li>Tap the <Share className="w-4 h-4 inline mx-1" /> <strong>Share</strong> button in the Safari browser's menu bar (usually at the bottom or top of your screen).</li>
            <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
          </ol>
        </div>
      ) : (
        <Button onClick={handleInstallClick} className="w-full">
          Add to Home Screen
        </Button>
      )}
    </div>
  );
}
