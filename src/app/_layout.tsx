import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppointmentsProvider } from '@/context/AppointmentsContext';
import { Colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <AppointmentsProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="booking" options={{ presentation: 'modal' }} />
        <Stack.Screen name="booking-success" options={{ gestureEnabled: false }} />
        <Stack.Screen name="doctors/[id]" />
      </Stack>
    </AppointmentsProvider>
  );
}
