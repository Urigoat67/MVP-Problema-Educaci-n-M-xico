'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { projectionKey, type ProjectionSnapshot } from '@/lib/classroom';
import { Comparison } from './comparacion';

const emptySnapshot = () => null;

export function LiveProjection({ id }: { id: string }) {
  const key = projectionKey(id);
  const subscribe = useCallback((change: () => void) => {
    function listener(event: StorageEvent) {
      if (event.key === key || event.key === null) change();
    }
    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  }, [key]);
  const read = useCallback(() => {
    try { return window.localStorage.getItem(key); }
    catch { return null; }
  }, [key]);
  const raw = useSyncExternalStore(subscribe, read, emptySnapshot);
  if (!raw) return <p className="section">Abre la proyección desde la actividad docente para ver entregas y puntos.</p>;

  let snapshot: ProjectionSnapshot;
  try { snapshot = JSON.parse(raw); }
  catch { return null; }
  return <Comparison snapshot={snapshot} />;
}
