// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import GeometricDivider from '../components/GeometricDivider';

const MOCK_LOCATION = { il: 'İstanbul', ilce: 'Beşiktaş' };

const MOCK_TIMES = [
  { key: 'imsak', label: 'İmsak', time: '03:54' },
  { key: 'gunes', label: 'Güneş', time: '05:44' },
  { key: 'ogle', label: 'Öğle', time: '13:16' },
  { key: 'ikindi', label: 'İkindi', time: '17:13' },
  { key: 'aksam', label: 'Akşam', time: '20:38' },
  { key: 'yatsi', label: 'Yatsı', time: '22:21' },
];

const MOCK_NEXT = { label: 'İkindi', time: '17:13', remaining: '2s 14dk' };

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.locationRow}>
          <Text style={styles.locationText}>
            {MOCK_LOCATION.il} · {MOCK_LOCATION.ilce}
          </Text>
          <Text style={styles.locationChevron}>▾</Text>
        </View>

        <View style={styles.mainCard}>
          <Text style={styles.nextLabel}>{MOCK_NEXT.label}</Text>
          <Text style={styles.nextTime}>{MOCK_NEXT.time}</Text>
          <Text style={styles.remaining}>-{MOCK_NEXT.remaining}</Text>
        </View>

        <GeometricDivider />

        <View style={styles.timesRow}>
          {MOCK_TIMES.map((t) => (
            <View
              key={t.key}
              style={[
                styles.timeItem,
                t.label === MOCK_NEXT.label && styles.timeItemActive,
              ]}
            >
              <Text
                style={[
                  styles.timeLabel,
                  t.label === MOCK_NEXT.label && styles.timeLabelActive,
                ]}
              >
                {t.label}
              </Text>
              <Text
                style={[
                  styles.timeValue,
                  t.label === MOCK_NEXT.label && styles.timeValueActive,
                ]}
              >
                {t.time}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  locationText: {
    color: colors.textOnDark,
    fontFamily: typography.bodyMedium,
    fontSize: 16,
  },
  locationChevron: {
    color: colors.gold,
    fontSize: 14,
  },
  mainCard: {
    backgroundColor: colors.cream,
    borderRadius: radius.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  nextLabel: {
    fontFamily: typography.bodyMedium,
    color: colors.primary,
    fontSize: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  nextTime: {
    fontFamily: typography.displayFamily,
    color: colors.textOnLight,
    fontSize: 56,
    marginTop: spacing.xs,
  },
  remaining: {
    fontFamily: typography.bodyMedium,
    color: colors.gold,
    fontSize: 15,
    marginTop: spacing.xs,
  },
  timesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  timeItem: {
    minWidth: 96,
    backgroundColor: 'rgba(250,246,236,0.08)',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.25)',
  },
  timeItemActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  timeLabel: {
    fontFamily: typography.bodyMedium,
    color: colors.sand,
    fontSize: 13,
  },
  timeLabelActive: {
    color: colors.primaryDark,
  },
  timeValue: {
    fontFamily: typography.displaySemibold,
    color: colors.textOnDark,
    fontSize: 18,
    marginTop: 2,
  },
  timeValueActive: {
    color: colors.primaryDark,
  },
});
