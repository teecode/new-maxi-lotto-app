import { lazy, Suspense, useEffect } from 'react'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import useAuthStore from '@/store/authStore';
import MobileBottomNav from '@/components/layouts/mobile-bottom-nav'
import type { AuthContext } from '@/store/authStore';
import { SeoManager } from '@/components/seo-manager';
import NotFound from '@/components/not-found';

// Loaded after the page itself: it brings socket.io and framer-motion, and it only
// matters once a live draw starts.
const LiveDrawOverlay = lazy(() =>
  import('@/components/LiveDrawOverlay').then((m) => ({ default: m.LiveDrawOverlay })),
);

type RouterContext = {
  auth: AuthContext;
};

const RootComponent = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const remoteToken = params.get('remoteToken');
    
    if (remoteToken) {
      useAuthStore.getState().setAccessToken(remoteToken);
      
      // Clean up the URL
      params.delete('remoteToken');
      const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.replaceState({}, '', newUrl);
      
      // We might want to reload to fetch the new user details correctly
      window.location.reload();
    }
  }, []);

  return (
    <>
      <SeoManager />
      <Outlet />
      <MobileBottomNav />
      <Suspense fallback={null}>
        <LiveDrawOverlay />
      </Suspense>
    </>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFound,
})
