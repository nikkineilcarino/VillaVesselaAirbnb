const localFallback = new URL("http://localhost:3000");

function isLocalHostname(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function parseCanonicalSiteUrl(value: null | string | undefined) {
  const candidate = value?.trim();
  if (!candidate) {
    return null;
  }

  try {
    const url = new URL(candidate);
    const isLocalHttp =
      url.protocol === "http:" && isLocalHostname(url.hostname);

    if (
      (url.protocol !== "https:" && !isLocalHttp) ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    ) {
      return null;
    }

    return new URL(url.origin);
  } catch {
    return null;
  }
}

export function getSiteUrl() {
  return (
    parseCanonicalSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    new URL(localFallback)
  );
}

export function isPublicIndexableSiteUrl(url = getSiteUrl()) {
  return (
    url.protocol === "https:" &&
    !isLocalHostname(url.hostname) &&
    !url.hostname.endsWith(".invalid")
  );
}

export function getAbsoluteSiteUrl(path: string) {
  return new URL(path, getSiteUrl()).toString();
}
