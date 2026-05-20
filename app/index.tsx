import { Redirect } from "expo-router";

import { BrandedLaunch } from "@/components/ui";
import { useLaunchRoute } from "@/features/onboarding/hooks/useLaunchRoute";

export default function Index() {
  const { href, loading } = useLaunchRoute();

  if (loading || !href) {
    return <BrandedLaunch />;
  }

  return <Redirect href={href} />;
}
