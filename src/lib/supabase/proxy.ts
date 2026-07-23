import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
  getSupabasePublicConfig,
  supabaseAuthCookieOptions,
} from "@/lib/supabase/config";
import type { Database } from "@/types/database";

const LOGIN_PATH = "/admin/login";
const privateCacheHeaders = {
  "Cache-Control": "private, no-cache, no-store, must-revalidate, max-age=0",
  Expires: "0",
  Pragma: "no-cache",
} as const;

function applyPrivateCacheHeaders(response: NextResponse) {
  for (const [name, value] of Object.entries(privateCacheHeaders)) {
    response.headers.set(name, value);
  }

  return response;
}

function redirectToLogin(request: NextRequest, cookieSource: NextResponse) {
  const response = NextResponse.redirect(new URL(LOGIN_PATH, request.url));

  for (const cookie of cookieSource.cookies.getAll()) {
    response.cookies.set(cookie);
  }

  return applyPrivateCacheHeaders(response);
}

/**
 * Refreshes/verifies an admin request's cookie session. This is an optimistic
 * request gate only; protected Server Components repeat authorization against
 * the RLS-protected admin_profiles table.
 */
export async function updateAdminSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const isLoginRequest = request.nextUrl.pathname === LOGIN_PATH;
  const config = getSupabasePublicConfig();

  if (!config) {
    return isLoginRequest
      ? applyPrivateCacheHeaders(response)
      : redirectToLogin(request, response);
  }

  const supabase = createServerClient<Database>(config.url, config.anonKey, {
    cookieOptions: supabaseAuthCookieOptions,
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }

        response = NextResponse.next({ request });

        for (const { name, options, value } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }

        for (const [name, value] of Object.entries(headers)) {
          response.headers.set(name, value);
        }
      },
    },
  });

  let hasVerifiedIdentity = false;

  try {
    const { data, error } = await supabase.auth.getClaims();
    hasVerifiedIdentity = !error && Boolean(data?.claims?.sub);
  } catch {
    hasVerifiedIdentity = false;
  }

  if (!isLoginRequest && !hasVerifiedIdentity) {
    return redirectToLogin(request, response);
  }

  return applyPrivateCacheHeaders(response);
}
