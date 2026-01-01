import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { BudgetRecord } from '@/types/budget';

const RECORDS_STORAGE_KEY = 'budget_records';

/**
 * Hook for managing budget records
 */
export function useBudgetRecords() {
  const [records, setRecordsState] = useState<BudgetRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Load saved records
  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const saved = await AsyncStorage.getItem(RECORDS_STORAGE_KEY);
      if (saved) {
        setRecordsState(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveRecord = async (record: BudgetRecord) => {
    try {
      const existing = records.find((r) => r.id === record.id);
      let updated: BudgetRecord[];

      if (existing) {
        // Update existing record
        updated = records.map((r) => (r.id === record.id ? record : r));
      } else {
        // Add new record
        updated = [...records, record];
      }

      await AsyncStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(updated));
      setRecordsState(updated);
      return record;
    } catch (error) {
      console.error('Error saving record:', error);
      throw error;
    }
  };

  const deleteRecord = async (recordId: string) => {
    try {
      const updated = records.filter((r) => r.id !== recordId);
      await AsyncStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(updated));
      setRecordsState(updated);
    } catch (error) {
      console.error('Error deleting record:', error);
      throw error;
    }
  };

  const getRecord = (recordId: string): BudgetRecord | undefined => {
    return records.find((r) => r.id === recordId);
  };

  return {
    records,
    loading,
    saveRecord,
    deleteRecord,
    getRecord,
  };
}
