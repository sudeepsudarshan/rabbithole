import type { TrendItem } from '@/types/trends';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class TtlCache<T> {
  private store = new Map<string, CacheEntry<T>>();

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.data;
  }

  set(key: string, data: T, ttlMs: number): void {
    this.store.set(key, { data, expiresAt: Date.now() + ttlMs });
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }
}

export const sourceCache = new TtlCache<TrendItem[]>();
export const feedCache = new TtlCache<TrendItem[]>();

export const TTL = {
  SOURCE: 2 * 60 * 60 * 1000,       // 2 hours
  FEED: 30 * 60 * 1000,              // 30 minutes
  WIKIPEDIA_UNUSUAL: 24 * 60 * 60 * 1000, // 24 hours
} as const;
