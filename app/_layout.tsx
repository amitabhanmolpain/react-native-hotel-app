import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { PropertyProvider } from '@/contexts/PropertyContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <PropertyProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="business/auth" />
        <Stack.Screen name="business/register" />
        <Stack.Screen name="business/dashboard" />
        <Stack.Screen name="(user)/home" />
        <Stack.Screen name="(user)/property/[id]" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </PropertyProvider>
  );
}
