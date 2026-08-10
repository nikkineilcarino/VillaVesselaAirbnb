"use client";

import Link from "next/link";
import { useState } from "react";

import { useAnalyticsConsent } from "./AnalyticsProvider";

export function AnalyticsConsent() {
  const { featureEnabled, preference, setPreference } = useAnalyticsConsent();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [storageMessage, setStorageMessage] = useState<null | string>(null);

  if (!featureEnabled) {
    return null;
  }

  const panelOpen = preference === "undecided" || settingsOpen;

  if (!panelOpen) {
    return (
      <button
        className="fixed right-4 bottom-4 z-20 min-h-11 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-primary shadow-soft hover:bg-surface-muted"
        onClick={() => {
          setStorageMessage(null);
          setSettingsOpen(true);
        }}
        type="button"
      >
        Analytics settings
      </button>
    );
  }

  return (
    <section
      aria-labelledby="analytics-consent-title"
      className="fixed right-4 bottom-4 left-4 z-20 mx-auto max-w-2xl rounded-card border border-border bg-surface p-5 shadow-2xl sm:p-6"
    >
      <h2
        className="text-lg font-semibold text-primary-dark"
        id="analytics-consent-title"
      >
        Help us improve Villa Vessela
      </h2>
      <p className="mt-2 text-sm leading-6 text-foreground/80">
        Allow anonymous page-view and approved external-link click analytics
        using random first-party IDs. We do not collect your name or exact
        location. You can change this choice at any time. Read our{" "}
        <Link
          className="font-semibold text-primary underline underline-offset-4"
          href="/privacy"
          prefetch={false}
        >
          privacy notice
        </Link>
        .
      </p>
      {preference !== "undecided" ? (
        <p aria-live="polite" className="mt-2 text-xs text-foreground/65">
          Current choice: {preference === "allowed" ? "Allowed" : "Declined"}
        </p>
      ) : null}
      {storageMessage ? (
        <p aria-live="polite" className="mt-2 text-sm font-medium text-danger">
          {storageMessage}
        </p>
      ) : null}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          className="min-h-11 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          onClick={() => {
            if (setPreference("allowed")) {
              setStorageMessage(null);
              setSettingsOpen(false);
            } else {
              setStorageMessage(
                "Your browser could not save this choice. Analytics remains off.",
              );
            }
          }}
          type="button"
        >
          Allow analytics
        </button>
        <button
          className="min-h-11 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-primary hover:bg-surface-muted"
          onClick={() => {
            if (setPreference("declined")) {
              setStorageMessage(null);
              setSettingsOpen(false);
            } else {
              setStorageMessage(
                "Analytics is off for this visit, but your browser could not remember the choice.",
              );
              setSettingsOpen(true);
            }
          }}
          type="button"
        >
          Decline
        </button>
        {preference !== "undecided" ? (
          <button
            className="min-h-11 rounded-full px-4 py-2.5 text-sm font-semibold text-foreground/75 hover:bg-surface-muted"
            onClick={() => setSettingsOpen(false)}
            type="button"
          >
            Close analytics settings
          </button>
        ) : null}
      </div>
    </section>
  );
}
