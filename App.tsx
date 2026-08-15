// App.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Cairo_700Bold, Cairo_600SemiBold } from '@expo-google-fonts/cairo';
import { Manrope_400Regular, Manrope_500Medium, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import { colors } from './src/theme';
import { LocationProvider } from './src/context/LocationContext';
import { NotificationSettingsProvider } from './src/context/NotificationSettingsContext';
import { CalculationSettingsProvider } from './src/context/CalculationSettingsContext';
import { KazaProvider } from './src/context/KazaContext';

export default function App() {
  const [fontsLoaded] = useFonts({
    Cairo_700Bold,
    Cairo_600SemiBold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary }}>
        <ActivityIndicator color={colors.gold} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <LocationProvider>
        <CalculationSettingsProvider>
          <KazaProvider>
            <NotificationSettingsProvider>
              <StatusBar style="light" />
              <HomeScreen />
            </NotificationSettingsProvider>
          </KazaProvider>
        </CalculationSettingsProvider>
      </LocationProvider>
    </SafeAreaProvider>
  );
}
