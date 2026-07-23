export type FixedWindowRateLimiterOptions = {
  limit: number;
  maxKeys: number;
  windowMs: number;
};

type Bucket = {
  count: number;
  expiresAt: number;
};

export class FixedWindowRateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(private readonly options: FixedWindowRateLimiterOptions) {}

  allow(key: string, now = Date.now()) {
    const existing = this.buckets.get(key);

    if (existing && existing.expiresAt > now) {
      if (existing.count >= this.options.limit) {
        return false;
      }

      existing.count += 1;
      return true;
    }

    if (this.buckets.size >= this.options.maxKeys) {
      for (const [bucketKey, bucket] of this.buckets) {
        if (bucket.expiresAt <= now) {
          this.buckets.delete(bucketKey);
        }
      }
    }

    if (this.buckets.size >= this.options.maxKeys) {
      return false;
    }

    this.buckets.set(key, {
      count: 1,
      expiresAt: now + this.options.windowMs,
    });
    return true;
  }
}

