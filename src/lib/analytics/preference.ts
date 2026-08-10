export const ANALYTICS_PREFERENCE_STORAGE_KEY = "vv_analytics_preference";
const ANALYTICS_PREFERENCE_CHANGE_EVENT = "vv:analytics-preference-change";

export type AnalyticsPreference = "allowed" | "declined";
type EffectiveAnalyticsPreference = AnalyticsPreference | "undecided";

let currentTabOverride: EffectiveAnalyticsPreference | null = null;

export function parseAnalyticsPreference(
  value: null | string,
): AnalyticsPreference | null {
  return value === "allowed" || value === "declined" ? value : null;
}

function readStoredAnalyticsPreference(): AnalyticsPreference | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return parseAnalyticsPreference(
      window.localStorage.getItem(ANALYTICS_PREFERENCE_STORAGE_KEY),
    );
  } catch {
    return null;
  }
}

export function readAnalyticsPreference(): EffectiveAnalyticsPreference | null {
  return currentTabOverride ?? readStoredAnalyticsPreference();
}

function notifyAnalyticsPreferenceChange() {
  try {
    window.dispatchEvent(new Event(ANALYTICS_PREFERENCE_CHANGE_EVENT));
  } catch {
    // A restricted event environment leaves the current tab safely untracked.
  }
}

function failClosedAfterPreferenceWriteFailure(
  preference: AnalyticsPreference,
) {
  if (preference === "declined") {
    try {
      // Quota and policy failures commonly block writes but still permit removal.
      // Removing a stale Allow makes the next full page load undecided, not allowed.
      window.localStorage.removeItem(ANALYTICS_PREFERENCE_STORAGE_KEY);
    } catch {
      // The current-tab override below still blocks identity creation and dispatch.
    }
  }

  currentTabOverride = preference === "declined" ? "declined" : "undecided";
  notifyAnalyticsPreferenceChange();
}

export function writeAnalyticsPreference(preference: AnalyticsPreference) {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(ANALYTICS_PREFERENCE_STORAGE_KEY, preference);
    const persisted = readStoredAnalyticsPreference() === preference;

    if (persisted) {
      currentTabOverride = null;
      notifyAnalyticsPreferenceChange();
    } else {
      failClosedAfterPreferenceWriteFailure(preference);
    }

    return persisted;
  } catch {
    // Storage-restricted browsers remain untracked because consent cannot be read back.
    failClosedAfterPreferenceWriteFailure(preference);
    return false;
  }
}

export function subscribeAnalyticsPreference(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === ANALYTICS_PREFERENCE_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(ANALYTICS_PREFERENCE_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(ANALYTICS_PREFERENCE_CHANGE_EVENT, onStoreChange);
  };
}

export function hasAnalyticsConsent() {
  return readAnalyticsPreference() === "allowed";
}
