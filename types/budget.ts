/**
 * Budget record structure
 * All amounts are stored in USD
 */
export interface BudgetRecord {
  id: string;
  name: string;
  totalBudget: number; // USD only
  medicalExpenses: number; // USD
  salaries: number; // USD
  carRental: number; // USD
  otherExpenses: number; // USD
  remaining: number; // USD (calculated)
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  userId: string; // User ID from auth
}

export interface BudgetFormData {
  totalBudget: number;
  medicalExpenses: number;
  salaries: number;
  carRental: number;
  otherExpenses: number;
}

export function calculateRemaining(data: BudgetFormData): number {
  const totalExpenses =
    data.medicalExpenses + data.salaries + data.carRental + data.otherExpenses;
  return data.totalBudget - totalExpenses;
}

export function calculateTotalExpenses(data: BudgetFormData): number {
  return data.medicalExpenses + data.salaries + data.carRental + data.otherExpenses;
}
