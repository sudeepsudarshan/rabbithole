'use client';

import { useCallback, useRef } from 'react';

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

export function useSwipe(
  onSwipeUp: () => void,
  onSwipeDown: () => void,
  threshold = 50
): SwipeHandlers {
  const touchStartRef = useRef<{ y: number; time: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = {
      y: e.touches[0].clientY,
      time: Date.now(),
    };
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;

      const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;
      const velocity = Math.abs(deltaY) / deltaTime;

      if (Math.abs(deltaY) >= threshold || velocity > 0.3) {
        if (deltaY < 0) {
          onSwipeUp();
        } else {
          onSwipeDown();
        }
      }

      touchStartRef.current = null;
    },
    [onSwipeUp, onSwipeDown, threshold]
  );

  return { onTouchStart, onTouchEnd };
}
