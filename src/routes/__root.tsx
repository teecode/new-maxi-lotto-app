import { useEffect } from 'react'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import useAuthStore from '@/store/authStore';
import MobileBottomNav from '@/components/layouts/mobile-bottom-nav'
import type { AuthContext } from '@/store/authStore';
import { LiveDrawOverlay } from '@/components/LiveDrawOverlay';

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
      <Outlet />
      <MobileBottomNav />
      <LiveDrawOverlay />
    </>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})
