import { useEffect, useState } from 'react';
import { WebContainer } from '@webcontainer/api';

/**
 * A simple hook that boots the WebContainer once on mount
 * and returns the instance when ready.
 */
export function useWebContainer() {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);

  useEffect(() => {
    async function boot() {
      try {
        const instance = await WebContainer.boot();
        setWebcontainer(instance);
      } catch (err) {
        console.error('Failed to boot WebContainer:', err);
      }
    }
    boot();
  }, []);

  return webcontainer;
}
