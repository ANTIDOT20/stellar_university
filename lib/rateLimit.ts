import { NextRequest, NextResponse } from "next/server";

interface RateEntry {
  count:     number;
  resetAt:   number;
}

const store = new Map<string, RateEntry>();

export interface RateLimitOptions {
  max:        number;
  windowSecs: number;
}

export function rateLimit(
  req:     NextRequest,
  options: RateLimitOptions
): { allowed: boolean; remaining: number; resetAt: number } {
  const ip  = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
              ?? req.headers.get("x-real-ip")
              ?? "unknown";
  const key = `${req.nextUrl.pathname}:${ip}`;
  const now = Date.now();

  let entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + options.windowSecs * 1000 };
  }
  entry.count++;
  store.set(key, entry);

  const allowed   = entry.count <= options.max;
  const remaining = Math.max(0, options.max - entry.count);

  return { allowed, remaining, resetAt: entry.resetAt };
}

export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: RateLimitOptions
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    const { allowed, remaining, resetAt } = rateLimit(req, options);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests", retryAfter: Math.ceil((resetAt - Date.now()) / 1000) },
        {
          status:  429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "Retry-After":           String(Math.ceil((resetAt - Date.now()) / 1000)),
          },
        }
      );
    }
    const res = await handler(req);
    res.headers.set("X-RateLimit-Remaining", String(remaining));
    return res;
  };
}
