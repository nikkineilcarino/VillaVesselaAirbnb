"use client";

import { ExternalLink, MapPinned, Minus, Plus, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type MapProvider = "google" | "waze";

type InteractiveMapsProps = {
  className?: string;
  googleMapsEmbedUrl: null | string;
  googleMapsUrl: null | string;
  wazeEmbedUrl: null | string;
  wazeUrl: null | string;
};

const providerLabels: Record<MapProvider, string> = {
  google: "Google Maps",
  waze: "Waze",
};

const zoomRanges: Record<MapProvider, { maximum: number; minimum: number }> = {
  google: { maximum: 21, minimum: 3 },
  waze: { maximum: 17, minimum: 12 },
};

function readInitialZoom(provider: MapProvider, embedUrl: null | string) {
  if (!embedUrl) return 17;

  const parameter = provider === "google" ? "z" : "zoom";
  const parsed = Number(new URL(embedUrl).searchParams.get(parameter));
  const { maximum, minimum } = zoomRanges[provider];

  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum ? parsed : 17;
}

function setEmbedZoom(provider: MapProvider, embedUrl: string, zoom: number) {
  const url = new URL(embedUrl);
  url.searchParams.set(provider === "google" ? "z" : "zoom", String(zoom));
  return url.toString();
}

export function InteractiveMaps({
  className,
  googleMapsEmbedUrl,
  googleMapsUrl,
  wazeEmbedUrl,
  wazeUrl,
}: InteractiveMapsProps) {
  const [activeProvider, setActiveProvider] = useState<null | MapProvider>(null);
  const [zoomLevels, setZoomLevels] = useState<Record<MapProvider, number>>(() => ({
    google: readInitialZoom("google", googleMapsEmbedUrl),
    waze: readInitialZoom("waze", wazeEmbedUrl),
  }));
  const availableProviders = [
    googleMapsEmbedUrl ? ("google" as const) : null,
    wazeEmbedUrl ? ("waze" as const) : null,
  ].filter((provider): provider is MapProvider => provider !== null);
  const configuredActiveEmbedUrl =
    activeProvider === "google"
      ? googleMapsEmbedUrl
      : activeProvider === "waze"
        ? wazeEmbedUrl
        : null;
  const activeEmbedUrl =
    activeProvider && configuredActiveEmbedUrl
      ? setEmbedZoom(
          activeProvider,
          configuredActiveEmbedUrl,
          zoomLevels[activeProvider],
        )
      : null;

  function changeZoom(change: -1 | 1) {
    if (!activeProvider) return;

    const provider = activeProvider;
    const { maximum, minimum } = zoomRanges[provider];
    setZoomLevels((current) => ({
      ...current,
      [provider]: Math.min(maximum, Math.max(minimum, current[provider] + change)),
    }));
  }

  return (
    <div className={cn("overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-soft", className)}>
      <div className="flex flex-col gap-4 border-b border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">Interactive property map</h2>
          <p className="mt-1 text-sm leading-6 text-foreground/70">
            Choose a provider, then use the accessible + and − controls to zoom.
          </p>
        </div>

        <div aria-label="Map provider" className="flex flex-wrap gap-2" role="group">
          {availableProviders.map((provider) => (
            <Button
              aria-controls="villa-vessela-map"
              aria-pressed={activeProvider === provider}
              className="shrink-0"
              key={provider}
              onClick={() => setActiveProvider(provider)}
              size="small"
              variant={activeProvider === provider ? "primary" : "secondary"}
            >
              {activeProvider === provider ? "Viewing" : "Load"} {providerLabels[provider]}
            </Button>
          ))}
        </div>

        {activeProvider ? (
          <div
            aria-label={`${providerLabels[activeProvider]} zoom controls`}
            className="flex items-center gap-2"
            role="group"
          >
            <Button
              aria-label={`Zoom out in ${providerLabels[activeProvider]}`}
              disabled={zoomLevels[activeProvider] <= zoomRanges[activeProvider].minimum}
              onClick={() => changeZoom(-1)}
              size="small"
              variant="secondary"
            >
              <Minus aria-hidden="true" size={18} />
            </Button>
            <span aria-live="polite" className="min-w-16 text-center text-xs font-semibold">
              Zoom {zoomLevels[activeProvider]}
            </span>
            <Button
              aria-label={`Zoom in on ${providerLabels[activeProvider]}`}
              disabled={zoomLevels[activeProvider] >= zoomRanges[activeProvider].maximum}
              onClick={() => changeZoom(1)}
              size="small"
              variant="secondary"
            >
              <Plus aria-hidden="true" size={18} />
            </Button>
          </div>
        ) : null}
      </div>

      <div
        className="relative flex h-80 min-w-0 items-center justify-center bg-surface-muted sm:h-auto sm:aspect-[9/7] sm:min-h-80"
        id="villa-vessela-map"
      >
        {activeEmbedUrl && activeProvider ? (
          <iframe
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
            key={activeProvider}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            src={activeEmbedUrl}
            title={`Villa Vessela location in ${providerLabels[activeProvider]}`}
          />
        ) : (
          <div className="max-w-md px-6 py-10 text-center">
            <MapPinned aria-hidden="true" className="mx-auto text-secondary" size={40} />
            <h3 className="mt-5 text-xl font-semibold">Choose a map to view the verified pin</h3>
            <p className="mt-3 text-sm leading-6 text-foreground/75">
              The map stays unloaded until you choose Google Maps or Waze. This keeps
              the page fast and avoids contacting either provider automatically.
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-border bg-surface p-5">
        <div className="flex items-start gap-3 text-sm leading-6 text-foreground/70">
          <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-secondary" size={19} />
          <p>
            Loading or opening a map shares normal connection information with that
            provider. The website does not request your device location.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {googleMapsUrl ? (
            <TrackedExternalLink
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
              href={googleMapsUrl}
              linkType="google_maps"
              rel="noopener noreferrer"
              target="_blank"
            >
              Open Google Maps
              <ExternalLink aria-hidden="true" size={16} />
            </TrackedExternalLink>
          ) : null}
          {wazeUrl ? (
            <TrackedExternalLink
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
              href={wazeUrl}
              linkType="waze"
              rel="noopener noreferrer"
              target="_blank"
            >
              Navigate with Waze
              <ExternalLink aria-hidden="true" size={16} />
            </TrackedExternalLink>
          ) : null}
        </div>
      </div>
    </div>
  );
}
