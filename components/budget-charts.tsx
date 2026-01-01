import { View, StyleSheet, Dimensions } from 'react-native';
import { ThemedText } from './themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BudgetRecord } from '@/types/budget';

interface BudgetChartsProps {
  records: BudgetRecord[];
}

export function BudgetCharts({ records }: BudgetChartsProps) {
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const cardColor = useThemeColor({}, 'card');

  // Calculate statistics
  const calculateStats = () => {
    if (records.length === 0) {
      return {
        totalBudget: 0,
        totalExpenses: 0,
        avgExpenses: 0,
        highestExpense: 0,
        categoryBreakdown: {
          medical: 0,
          salaries: 0,
          carRental: 0,
          other: 0,
        },
      };
    }

    let totalBudget = 0;
    let totalExpenses = 0;
    const categoryBreakdown = {
      medical: 0,
      salaries: 0,
      carRental: 0,
      other: 0,
    };

    records.forEach((record) => {
      totalBudget += record.totalBudget;
      const expenses =
        record.medicalExpenses +
        record.salaries +
        record.carRental +
        record.otherExpenses;
      totalExpenses += expenses;

      categoryBreakdown.medical += record.medicalExpenses;
      categoryBreakdown.salaries += record.salaries;
      categoryBreakdown.carRental += record.carRental;
      categoryBreakdown.other += record.otherExpenses;
    });

    const avgExpenses = records.length > 0 ? totalExpenses / records.length : 0;
    const highestExpense = Math.max(
      categoryBreakdown.medical,
      categoryBreakdown.salaries,
      categoryBreakdown.carRental,
      categoryBreakdown.other
    );

    return {
      totalBudget,
      totalExpenses,
      avgExpenses,
      highestExpense,
      categoryBreakdown,
    };
  };

  const stats = calculateStats();
  const spendingPercentage =
    stats.totalBudget > 0 ? (stats.totalExpenses / stats.totalBudget) * 100 : 0;

  const categories = [
    {
      name: 'مصروفات علاج',
      nameEn: 'Medical',
      value: stats.categoryBreakdown.medical,
      color: '#FF6B6B',
    },
    {
      name: 'مرتبات',
      nameEn: 'Salaries',
      value: stats.categoryBreakdown.salaries,
      color: '#4ECDC4',
    },
    {
      name: 'إيجار السيارة',
      nameEn: 'Car Rental',
      value: stats.categoryBreakdown.carRental,
      color: '#45B7D1',
    },
    {
      name: 'مصروفات أخرى',
      nameEn: 'Other',
      value: stats.categoryBreakdown.other,
      color: '#FFA07A',
    },
  ];

  const maxCategoryValue = Math.max(...categories.map((c) => c.value), 1);

  return (
    <View style={styles.container}>
      {/* Summary Stats */}
      <View style={[styles.statsGrid, { backgroundColor: cardColor }]}>
        <View style={styles.statItem}>
          <ThemedText type="defaultSemiBold" style={styles.statLabel}>
            إجمالي الميزانية
          </ThemedText>
          <ThemedText
            type="title"
            style={[styles.statValue, { color: tintColor }]}
          >
            ${stats.totalBudget.toFixed(2)}
          </ThemedText>
        </View>

        <View style={styles.statItem}>
          <ThemedText type="defaultSemiBold" style={styles.statLabel}>
            إجمالي النفقات
          </ThemedText>
          <ThemedText
            type="title"
            style={[
              styles.statValue,
              { color: spendingPercentage > 80 ? '#FF6B6B' : '#4ECDC4' },
            ]}
          >
            ${stats.totalExpenses.toFixed(2)}
          </ThemedText>
        </View>

        <View style={styles.statItem}>
          <ThemedText type="defaultSemiBold" style={styles.statLabel}>
            نسبة الإنفاق
          </ThemedText>
          <ThemedText
            type="title"
            style={[
              styles.statValue,
              { color: spendingPercentage > 80 ? '#FF6B6B' : '#4ECDC4' },
            ]}
          >
            {spendingPercentage.toFixed(1)}%
          </ThemedText>
        </View>

        <View style={styles.statItem}>
          <ThemedText type="defaultSemiBold" style={styles.statLabel}>
            متوسط النفقات
          </ThemedText>
          <ThemedText
            type="title"
            style={[styles.statValue, { color: tintColor }]}
          >
            ${stats.avgExpenses.toFixed(2)}
          </ThemedText>
        </View>
      </View>

      {/* Category Breakdown */}
      <View style={[styles.section, { backgroundColor: cardColor }]}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          توزيع النفقات حسب الفئة
        </ThemedText>

        {categories.map((category, index) => {
          const percentage =
            stats.totalExpenses > 0
              ? (category.value / stats.totalExpenses) * 100
              : 0;
          const barWidth = (category.value / maxCategoryValue) * 100;

          return (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <ThemedText type="default" style={styles.categoryName}>
                  {category.name}
                </ThemedText>
                <ThemedText
                  type="defaultSemiBold"
                  style={[styles.categoryValue, { color: category.color }]}
                >
                  ${category.value.toFixed(2)} ({percentage.toFixed(1)}%)
                </ThemedText>
              </View>

              <View style={[styles.barContainer, { backgroundColor: '#E0E0E0' }]}>
                <View
                  style={[
                    styles.bar,
                    {
                      width: `${Math.max(barWidth, 5)}%`,
                      backgroundColor: category.color,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>

      {/* Monthly Trend (if multiple records) */}
      {records.length > 1 && (
        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            عدد السجلات
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.trendValue}>
            {records.length} سجل محفوظ
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  statsGrid: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 18,
  },
  section: {
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    flex: 1,
  },
  categoryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  barContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  trendValue: {
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: 8,
  },
});
