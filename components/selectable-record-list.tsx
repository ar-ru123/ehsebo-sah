import { useState, useCallback } from 'react';
import {
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  View,
} from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BudgetRecord } from '@/types/budget';
import { formatCurrency } from '@/constants/exchange-rates';

interface SelectableRecordListProps {
  records: BudgetRecord[];
  onDeleteSelected: (recordIds: string[]) => Promise<void>;
  onEditRecord: (record: BudgetRecord) => void;
  translate: (key: any) => string;
}

export function SelectableRecordList({
  records,
  onDeleteSelected,
  onEditRecord,
  translate,
}: SelectableRecordListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const dangerColor = useThemeColor({}, 'danger');
  const tintColor = useThemeColor({}, 'tint');

  const toggleSelection = useCallback((recordId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(recordId)) {
        newSet.delete(recordId);
      } else {
        newSet.add(recordId);
      }
      return newSet;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === records.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(records.map((r) => r.id)));
    }
  }, [records, selectedIds.size]);

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) {
      Alert.alert(translate('error'), translate('selectRecordsFirst'));
      return;
    }

    Alert.alert(
      translate('delete'),
      `${translate('deleteConfirm')} ${selectedIds.size} ${translate('records')}?`,
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
              setIsDeleting(true);
              await onDeleteSelected(Array.from(selectedIds));
              setSelectedIds(new Set());
              Alert.alert(translate('appName'), translate('recordsDeleted'));
            } catch (error) {
              Alert.alert(translate('error'), translate('errorDeleting'));
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const renderRecord = ({ item }: { item: BudgetRecord }) => {
    const isSelected = selectedIds.has(item.id);

    return (
      <View style={[styles.recordRow, { borderColor }]}>
        <Pressable
          style={styles.checkboxContainer}
          onPress={() => toggleSelection(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <View
            style={[
              styles.checkbox,
              {
                backgroundColor: isSelected ? tintColor : 'transparent',
                borderColor: isSelected ? tintColor : borderColor,
              },
            ]}
          >
            {isSelected && (
              <ThemedText style={styles.checkmark}>✓</ThemedText>
            )}
          </View>
        </Pressable>

        <Pressable
          style={[styles.recordCard, { backgroundColor: cardColor }]}
          onPress={() => onEditRecord(item)}
        >
          <View style={styles.recordHeader}>
            <ThemedText type="subtitle" style={styles.recordName}>
              {item.name}
            </ThemedText>
            <ThemedText
              style={[
                styles.recordValue,
                { color: item.remaining < 0 ? dangerColor : '#43A047' },
              ]}
            >
              {formatCurrency(item.remaining, 'USD')}
            </ThemedText>
          </View>

          <View style={styles.recordDetails}>
            <ThemedText style={[styles.detailText, { color: textSecondary }]}>
              {translate('totalBudget')}: {formatCurrency(item.totalBudget, 'USD')}
            </ThemedText>
            <ThemedText style={[styles.detailText, { color: textSecondary }]}>
              {new Date(item.createdAt).toLocaleDateString()}
            </ThemedText>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* Selection Header */}
      {records.length > 0 && (
        <View style={[styles.selectionHeader, { backgroundColor: cardColor }]}>
          <Pressable
            style={styles.selectAllButton}
            onPress={toggleSelectAll}
          >
            <View
              style={[
                styles.checkbox,
                {
                  backgroundColor:
                    selectedIds.size === records.length ? tintColor : 'transparent',
                  borderColor:
                    selectedIds.size === records.length ? tintColor : borderColor,
                },
              ]}
            >
              {selectedIds.size === records.length && (
                <ThemedText style={styles.checkmark}>✓</ThemedText>
              )}
            </View>
            <ThemedText style={styles.selectAllText}>
              {selectedIds.size === records.length
                ? translate('deselectAll')
                : translate('selectAll')}
            </ThemedText>
          </Pressable>

          {selectedIds.size > 0 && (
            <View style={styles.selectedInfo}>
              <ThemedText style={[styles.selectedCount, { color: tintColor }]}>
                {selectedIds.size} {translate('selected')}
              </ThemedText>
              <Pressable
                style={[styles.deleteButton, { backgroundColor: dangerColor }]}
                onPress={handleDeleteSelected}
                disabled={isDeleting}
              >
                <ThemedText style={styles.deleteButtonText}>
                  {isDeleting ? '...' : translate('delete')}
                </ThemedText>
              </Pressable>
            </View>
          )}
        </View>
      )}

      {/* Records List */}
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={renderRecord}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectionHeader: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  selectedCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  checkboxContainer: {
    paddingTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recordCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordName: {
    flex: 1,
  },
  recordValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  recordDetails: {
    gap: 4,
  },
  detailText: {
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: 0,
  },
});
