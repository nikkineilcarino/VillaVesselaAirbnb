export type FixedWindowRateLimiterOptions = {
  limit: number;
  maxKeys: number;
  windowMs: number;
};

export type FixedWindowRateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

type Bucket = {
  count: number;
  expiresAt: number;
};

export class FixedWindowRateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(private readonly options: FixedWindowRateLimiterOptions) {}

  consume(key: string, now = Date.now()): FixedWindowRateLimitResult {
    const existing = this.buckets.get(key);

    if (existing && existing.expiresAt > now) {
      if (existing.count >= this.options.limit) {
        return {
          allowed: false,
          retryAfterSeconds: Math.max(
            1,
            Math.ceil((existing.expiresAt - now) / 1_000),
          ),
        };
      }

      existing.count += 1;
      return { allowed: true, retryAfterSeconds: 0 };
    }

    if (this.buckets.size >= this.options.maxKeys) {
      for (const [bucketKey, bucket] of this.buckets) {
        if (bucket.expiresAt <= now) {
          this.buckets.delete(bucketKey);
        }
      }
    }

    if (this.buckets.size >= this.options.maxKeys) {
      const earliestExpiry = Math.min(
        ...Array.from(this.buckets.values(), (bucket) => bucket.expiresAt),
      );
      return {
        allowed: false,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((earliestExpiry - now) / 1_000),
        ),
      };
    }

    this.buckets.set(key, {
      count: 1,
      expiresAt: now + this.options.windowMs,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  allow(key: string, now = Date.now()) {
    return this.consume(key, now).allowed;
  }
}
