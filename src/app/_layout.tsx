import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Slot } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import React, { Suspense } from 'react';
import { ActivityIndicator, View, useColorScheme } from 'react-native';

import { initDatabase } from '@/database/sqlite';

function LoadingFallback() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Suspense fallback={<LoadingFallback />}>
        <SQLiteProvider
          databaseName="budget_manager.db"
          onInit={initDatabase}
        >
          <Slot />
        </SQLiteProvider>
      </Suspense>
    </ThemeProvider>
  );
}