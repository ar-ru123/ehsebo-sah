// Import googleapis when available
// import { google } from 'googleapis';
import type { BudgetRecord } from '@/types/budget';

// Placeholder for google API
const google: any = {};

/**
 * Google Sheets Service
 * Handles all interactions with Google Sheets API
 */
class GoogleSheetsService {
  private sheets: any;
  private drive: any;
  private initialized: boolean = false;

  constructor() {
    // Initialize Google APIs
    // Note: In production, use service account credentials
    // For now, this is a placeholder implementation
    console.log('[Google Sheets Service] Initialized');
  }

  /**
   * Initialize Google Sheets with OAuth credentials
   */
  async initializeWithOAuth(accessToken: string) {
    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });

      this.sheets = google.sheets({ version: 'v4', auth });
      this.drive = google.drive({ version: 'v3', auth });

      console.log('[Google Sheets] Initialized with OAuth');
      return true;
    } catch (error) {
      console.error('[Google Sheets] Failed to initialize:', error);
      return false;
    }
  }

  /**
   * Create a new spreadsheet for user
   */
  async createUserSpreadsheet(userId: string, userName: string): Promise<string | null> {
    try {
      if (!this.sheets) {
        console.error('[Google Sheets] Not initialized');
        return null;
      }

      // Create spreadsheet
      const response = await this.sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: `Ehsebo Sah - ${userName}`,
            locale: 'ar_SA',
          },
          sheets: [
            {
              properties: {
                sheetId: 0,
                title: 'Budget Records',
              },
            },
          ],
        },
      });

      const spreadsheetId = response.data.spreadsheetId;

      // Add headers
      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Budget Records!A1:K1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [
            [
              'ID',
              'Name',
              'Total Budget',
              'Medical',
              'Salaries',
              'Car Rental',
              'Other',
              'Remaining',
              'Created At',
              'Updated At',
              'User ID',
            ],
          ],
        },
      });

      console.log(`[Google Sheets] Created spreadsheet: ${spreadsheetId}`);
      return spreadsheetId;
    } catch (error) {
      console.error('[Google Sheets] Error creating spreadsheet:', error);
      return null;
    }
  }

  /**
   * Save record to Google Sheets
   */
  async saveRecord(
    spreadsheetId: string,
    record: BudgetRecord
  ): Promise<boolean> {
    try {
      if (!this.sheets) {
        console.error('[Google Sheets] Not initialized');
        return false;
      }

      const values = [
        [
          record.id,
          record.name,
          record.totalBudget,
          record.medicalExpenses,
          record.salaries,
          record.carRental,
          record.otherExpenses,
          record.remaining,
          record.createdAt,
          record.updatedAt,
          record.userId,
        ],
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Budget Records!A:K',
        valueInputOption: 'RAW',
        requestBody: { values },
      });

      console.log(`[Google Sheets] Saved record: ${record.id}`);
      return true;
    } catch (error) {
      console.error('[Google Sheets] Error saving record:', error);
      return false;
    }
  }

  /**
   * Load all records from Google Sheets
   */
  async loadRecords(spreadsheetId: string): Promise<BudgetRecord[]> {
    try {
      if (!this.sheets) {
        console.error('[Google Sheets] Not initialized');
        return [];
      }

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Budget Records!A2:K',
      });

      const rows = response.data.values || [];
      const records: BudgetRecord[] = rows.map((row: any[]) => ({
        id: row[0],
        name: row[1],
        totalBudget: parseFloat(row[2]) || 0,
        medicalExpenses: parseFloat(row[3]) || 0,
        salaries: parseFloat(row[4]) || 0,
        carRental: parseFloat(row[5]) || 0,
        otherExpenses: parseFloat(row[6]) || 0,
        remaining: parseFloat(row[7]) || 0,
        createdAt: row[8],
        updatedAt: row[9],
        userId: row[10],
      }));

      console.log(`[Google Sheets] Loaded ${records.length} records`);
      return records;
    } catch (error) {
      console.error('[Google Sheets] Error loading records:', error);
      return [];
    }
  }

  /**
   * Delete record from Google Sheets
   */
  async deleteRecord(
    spreadsheetId: string,
    recordId: string
  ): Promise<boolean> {
    try {
      if (!this.sheets) {
        console.error('[Google Sheets] Not initialized');
        return false;
      }

      // Get all records to find the row
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Budget Records!A:A',
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex((row: any[]) => row[0] === recordId);

      if (rowIndex === -1) {
        console.warn(`[Google Sheets] Record not found: ${recordId}`);
        return false;
      }

      // Delete the row
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: 0,
                  dimension: 'ROWS',
                  startIndex: rowIndex,
                  endIndex: rowIndex + 1,
                },
              },
            },
          ],
        },
      });

      console.log(`[Google Sheets] Deleted record: ${recordId}`);
      return true;
    } catch (error) {
      console.error('[Google Sheets] Error deleting record:', error);
      return false;
    }
  }

  /**
   * Share spreadsheet with another user
   */
  async shareSpreadsheet(
    spreadsheetId: string,
    email: string,
    role: 'reader' | 'writer' | 'owner' = 'reader'
  ): Promise<boolean> {
    try {
      if (!this.drive) {
        console.error('[Google Drive] Not initialized');
        return false;
      }

      await this.drive.permissions.create({
        fileId: spreadsheetId,
        requestBody: {
          role,
          type: 'user',
          emailAddress: email,
        },
      });

      console.log(
        `[Google Drive] Shared spreadsheet ${spreadsheetId} with ${email}`
      );
      return true;
    } catch (error) {
      console.error('[Google Drive] Error sharing spreadsheet:', error);
      return false;
    }
  }
}

// Export singleton instance
export const googleSheetsService = new GoogleSheetsService();
