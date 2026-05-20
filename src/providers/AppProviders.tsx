import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { migrateDatabase } from "@/db";
import { initI18n } from "@/i18n";
import { ThemeProvider } from "@/theme";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        await migrateDatabase();
        await initI18n();
        setReady(true);
      } catch {
        setReady(true);
      }
    })();
  }, []);

  if (!ready) {
    return (
      <GestureHandlerRootView className="flex-1">
        <View className="flex-1 items-center justify-center bg-background">
          <ActivityIndicator accessibilityLabel="Loading" />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <ThemeProvider mode="light">{children}</ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
