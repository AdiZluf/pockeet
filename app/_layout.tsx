import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AppProviders } from "@/providers/AppProviders";
import React from "react";

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="capture"
          options={{ presentation: "fullScreenModal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen name="receipt/[id]/index" />
        <Stack.Screen name="receipt/[id]/processing" />
        <Stack.Screen name="receipt/[id]/review" />
        <Stack.Screen
          name="settings"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
      </Stack>
    </AppProviders>
  );
}
