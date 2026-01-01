import { useAuth } from './use-auth';
import { BudgetRecord } from '@/types/budget';

/**
 * Hook for Google Sheets integration
 * Note: This requires backend API to handle OAuth tokens securely
 */
export function useGoogleSheets() {
  const { user } = useAuth();

  const saveToGoogleSheets = async (record: BudgetRecord): Promise<boolean> => {
    try {
      if (!user?.id) {
        console.error('User not authenticated');
        return false;
      }

      // Call backend API to save to Google Sheets
      const response = await fetch('/api/google-sheets/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          record: record,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save to Google Sheets');
      }

      const data = await response.json();
      console.log('Saved to Google Sheets:', data);
      return true;
    } catch (error) {
      console.error('Error saving to Google Sheets:', error);
      return false;
    }
  };

  const loadFromGoogleSheets = async (): Promise<BudgetRecord[]> => {
    try {
      if (!user?.id) {
        console.error('User not authenticated');
        return [];
      }

      // Call backend API to load from Google Sheets
      const response = await fetch(`/api/google-sheets/load?userId=${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load from Google Sheets');
      }

      const data = await response.json();
      return data.records || [];
    } catch (error) {
      console.error('Error loading from Google Sheets:', error);
      return [];
    }
  };

  const createUserSheet = async (): Promise<string | null> => {
    try {
      if (!user?.id) {
        console.error('User not authenticated');
        return null;
      }

      // Call backend API to create user sheet
      const response = await fetch('/api/google-sheets/create-sheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name || user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create sheet');
      }

      const data = await response.json();
      return data.sheetId || null;
    } catch (error) {
      console.error('Error creating sheet:', error);
      return null;
    }
  };

  return {
    saveToGoogleSheets,
    loadFromGoogleSheets,
    createUserSheet,
  };
}
