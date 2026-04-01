import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import MobileBottomNav from '@/components/layouts/mobile-bottom-nav'
import type { AuthContext } from '@/store/authStore';
import { LiveDrawOverlay } from '@/components/LiveDrawOverlay';

type RouterContext = {
  auth: AuthContext;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      <MobileBottomNav />
      <LiveDrawOverlay />
    </>
  ),
})
