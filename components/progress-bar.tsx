import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { formatCurrency } from '@/constants/exchange-rates';

interface ProgressBarProps {
  total: number;
  spent: number;
  spentLabel: string;
  ofLabel: string;
}

export function ProgressBar({ total, spent, spentLabel, ofLabel }: ProgressBarProps) {
  const backgroundColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');
  const dangerColor = useThemeColor({}, 'danger');
  const textSecondary = useThemeColor({}, 'textSecondary');

  const percentage = total > 0 ? Math.min((spent / total) * 100, 100) : 0;
  
  // Determine color based on percentage
  let barColor = successColor;
  if (percentage >= 90) {
    barColor = dangerColor;
  } else if (percentage >= 70) {
    barColor = warningColor;
  }

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      <View style={styles.labelContainer}>
        <ThemedText style={[styles.label, { color: textSecondary }]}>
          {spentLabel}: {formatCurrency(spent, 'USD')} {ofLabel} {formatCurrency(total, 'USD')}
        </ThemedText>
        <ThemedText style={[styles.percentage, { color: barColor }]}>
          {percentage.toFixed(1)}%
        </ThemedText>
      </View>
      <View style={[styles.barBackground, { backgroundColor: borderColor }]}>
        <View
          style={[
            styles.barFill,
            {
              width: `${percentage}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    flex: 1,
  },
  percentage: {
    fontSize: 18,
    fontWeight: '700',
  },
  barBackground: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
});
