import { useState, useEffect } from 'react';
import {
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  View,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BudgetCharts } from '@/components/budget-charts';
import { SelectableRecordList } from '@/components/selectable-record-list';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BudgetRecord } from '@/types/budget';
import { formatCurrency } from '@/constants/exchange-rates';
import { useBudgetRecords } from '@/hooks/use-budget-records';

export default function HistoryScreen() {
  const { isAuthenticated } = useAuth();
  const { translate } = useLanguage();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const dangerColor = useThemeColor({}, 'danger');

  // TODO: Load records from Google Sheets
  const { records, deleteRecord: deleteRecordFromStorage } = useBudgetRecords();

  const handleDelete = (record: BudgetRecord) => {
    Alert.alert(
      translate('delete'),
      translate('deleteConfirm'),
      [
        {
          text: translate('cancel'),
          style: 'cancel',
        },
        {
          text: translate('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecordFromStorage(record.id);
              Alert.alert(translate('appName'), translate('recordDeleted'));
            } catch (error) {
              Alert.alert(translate('error'), translate('errorDeleting'));
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEdit = (record: BudgetRecord) => {
    // Navigate to home screen with record data
    router.push({
      pathname: '/(tabs)',
      params: {
        editRecord: JSON.stringify(record),
      },
    });
  };

  const handleDeleteSelected = async (recordIds: string[]) => {
    try {
      for (const id of recordIds) {
        await deleteRecordFromStorage(id);
      }
    } catch (error) {
      console.error('Error deleting records:', error);
      throw error;
    }
  };

  // Removed renderRecord - now using SelectableRecordList component

  useEffect(() => {
    // Delay navigation to ensure Root Layout is mounted
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.replace('/login');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <ThemedView style={styles.centerContainer}>
          <ActivityIndicator size="large" />
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView
        style={[
          styles.header,
          {
            paddingTop: insets.top + 20,
            backgroundColor,
          },
        ]}
      >
        <ThemedText type="title" style={styles.title}>
          {translate('history')}
        </ThemedText>
      </ThemedView>

      {records.length === 0 ? (
        <ThemedView style={styles.centerContainer}>
          <ThemedText style={{ color: textSecondary }}>
            {translate('noRecords')}
          </ThemedText>
        </ThemedView>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          <View style={styles.chartsContainer}>
            <BudgetCharts records={records} />
          </View>
          <View style={styles.recordsContainer}>
            <SelectableRecordList
              records={records}
              onDeleteSelected={handleDeleteSelected}
              onEditRecord={handleEdit}
              translate={translate}
            />
          </View>
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  listContent: {
    padding: 16,
  },
  scrollContent: {
    padding: 16,
  },
  chartsContainer: {
    marginBottom: 24,
  },
  recordsContainer: {
    marginTop: 16,
  },
  recordCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordName: {
    flex: 1,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordLabel: {
    fontSize: 14,
  },
  recordValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  recordDate: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'right',
  },
});
