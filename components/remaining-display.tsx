import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet, View, Animated, useWindowDimensions } from 'react-native';
import { ThemedText } from './themed-text';
import { formatCurrency, convertUsdToRub } from '@/constants/exchange-rates';
import { useEffect, useRef } from 'react';

interface RemainingDisplayProps {
  remaining: number;
  total: number;
}

export function RemainingDisplay({ remaining, total }: RemainingDisplayProps) {
  const backgroundColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const successColor = useThemeColor({}, 'success');
  const dangerColor = useThemeColor({}, 'danger');
  const textSecondary = useThemeColor({}, 'textSecondary');

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { width } = useWindowDimensions();

  // Determine color based on remaining amount
  const isNegative = remaining < 0;
  const displayColor = isNegative ? dangerColor : successColor;

  // Animate scale when remaining changes
  useEffect(() => {
    scaleAnim.setValue(0.95);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  }, [remaining]);

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
  };

  const percentage = total > 0 ? Math.max(0, (remaining / total) * 100) : 0;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={[styles.card, { backgroundColor, borderColor }]}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={[styles.label, { color: textSecondary }]}>
            المتبقي من الميزانية
          </ThemedText>
          <View style={[styles.badge, { backgroundColor: displayColor }]}>
            <ThemedText style={styles.badgeText}>
              {percentage.toFixed(0)}%
            </ThemedText>
          </View>
        </View>

        {/* Main Display */}
        <View style={styles.mainDisplay}>
          <View style={styles.currencyRow}>
            <View style={styles.currencyItem}>
              <ThemedText style={[styles.currencyLabel, { color: textSecondary }]}>
                دولار
              </ThemedText>
              <ThemedText
                style={[
                  styles.currencyValue,
                  { color: displayColor },
                ]}
              >
                {formatCurrency(remaining, 'USD')}
              </ThemedText>
            </View>

            <View style={styles.divider} />

            <View style={styles.currencyItem}>
              <ThemedText style={[styles.currencyLabel, { color: textSecondary }]}>
                روبل
              </ThemedText>
              <ThemedText
                style={[
                  styles.currencyValue,
                  { color: displayColor },
                ]}
              >
                {formatCurrency(convertUsdToRub(remaining), 'RUB')}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Status Message */}
        <View style={styles.statusContainer}>
          {isNegative ? (
            <ThemedText style={[styles.statusText, { color: dangerColor }]}>
              ⚠️ تم تجاوز الميزانية بمقدار {formatCurrency(Math.abs(remaining), 'USD')}
            </ThemedText>
          ) : (
            <ThemedText style={[styles.statusText, { color: successColor }]}>
              ✓ ميزانية متبقية بشكل جيد
            </ThemedText>
          )}
        </View>

        {/* Progress Indicator */}
        <View style={[styles.progressBar, { backgroundColor: borderColor }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: displayColor,
              },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  mainDisplay: {
    marginBottom: 16,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  currencyItem: {
    alignItems: 'center',
    flex: 1,
  },
  currencyLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  currencyValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginHorizontal: 16,
  },
  statusContainer: {
    marginBottom: 12,
    paddingVertical: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
