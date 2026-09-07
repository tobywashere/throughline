import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts as useFraunces,
  Fraunces_500Medium,
  Fraunces_500Medium_Italic,
} from '@expo-google-fonts/fraunces';
import {
  useFonts as useInter,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { useStore } from '../src/store/useStore';
import { colors } from '../src/theme';

export default function RootLayout() {
  const [frauncesLoaded] = useFraunces({ Fraunces_500Medium, Fraunces_500Medium_Italic });
  const [interLoaded] = useInter({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold });
  const hydrate = useStore((s) => s.hydrate);
  const isHydrated = useStore((s) => s.isHydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const ready = frauncesLoaded && interLoaded && isHydrated;

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paper }}>
        <ActivityIndicator color={colors.rose} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="person/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="date/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="new-person" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="new-date" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="new-note" options={{ presentation: 'modal', headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
