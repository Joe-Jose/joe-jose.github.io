import { useEffect, useState } from 'react';

/**
 * Checks if a configured local asset path actually resolves (and isn't an SPA HTML fallback).
 * Empty string immediately resolves to false so optional placeholders hide cleanly.
 */
export function useAssetExists(url: string | undefined, expectedContentPrefix?: string): boolean {
  const trimmed = (url ?? '').trim();
  const [exists, setExists] = useState<boolean>(Boolean(trimmed));

  useEffect(() => {
    if (!trimmed) {
      setExists(false);
      return;
    }
    if (/^https?:\/\//i.test(trimmed)) {
      setExists(true);
      return;
    }

    let cancelled = false;
    setExists(true);

    fetch(trimmed, { method: 'HEAD' })
      .then((res) => {
        if (cancelled) return;
        if (!res.ok) {
          setExists(false);
          return;
        }
        const ct = res.headers.get('content-type') || '';
        if (expectedContentPrefix && !ct.toLowerCase().includes(expectedContentPrefix.toLowerCase())) {
          if (ct.toLowerCase().includes('text/html')) {
            setExists(false);
            return;
          }
        }
        setExists(true);
      })
      .catch(() => {
        if (!cancelled) setExists(false);
      });

    return () => {
      cancelled = true;
    };
  }, [trimmed, expectedContentPrefix]);

  return exists;
}
