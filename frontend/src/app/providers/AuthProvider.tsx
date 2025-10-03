import { type PropsWithChildren, useEffect } from 'react';
import { useAuthStore } from '../../modules/auth/store/authStore';

export function AuthProvider({ children }: PropsWithChildren) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      void initialize();
      return;
    }

    const unsubscribe = useAuthStore.persist.onFinishHydration?.(() => {
      void initialize();
    });

    return () => {
      unsubscribe?.();
    };
  }, [initialize]);

  return children;
}
