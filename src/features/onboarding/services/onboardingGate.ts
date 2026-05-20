import type { Href } from "expo-router";

import {
  deleteAppPreference,
  getAppPreference,
  setAppPreference,
} from "@/db/repositories/appPreferencesRepository";

import {
  AUTH_SESSION_GUEST,
  PREF_AUTH_SESSION,
  PREF_ONBOARDING_COMPLETED,
} from "../constants";

export async function resolveLaunchRoute(): Promise<Href> {
  const onboardingDone = await getAppPreference(PREF_ONBOARDING_COMPLETED);
  if (onboardingDone !== "1") {
    return "/(auth)/onboarding";
  }

  const authSession = await getAppPreference(PREF_AUTH_SESSION);
  if (!authSession) {
    return "/(auth)/login";
  }

  return "/(tabs)";
}

export async function markOnboardingCompleted(): Promise<void> {
  await setAppPreference(PREF_ONBOARDING_COMPLETED, "1");
}

export async function markGuestSession(): Promise<void> {
  await setAppPreference(PREF_AUTH_SESSION, AUTH_SESSION_GUEST);
}

export async function resetOnboardingState(): Promise<void> {
  await deleteAppPreference(PREF_ONBOARDING_COMPLETED);
  await deleteAppPreference(PREF_AUTH_SESSION);
}
