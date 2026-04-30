export interface User {
  id: string;
  name: string;
  email: string;
  salary: number;
}

export interface Expense {
  _id?: string;
  date: string;
  category: string;
  note?: string;
  amount: number;
  createdAt?: string;
}

export interface Goal {
  _id?: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  emoji?: string;
  completed?: boolean;
}

export interface MonthlySummary {
  month: string;
  totalSpent: number;
  breakdown: CategoryBreakdown[];
}

export interface CategoryBreakdown {
  _id: string;
  total: number;
  count: number;
}

export interface TrendData {
  label: string;
  total: number;
}

export const CATEGORIES = [
  'Rent', 'Groceries', 'Petrol', 'Zomato / Swiggy', 'Eating out',
  'Subscriptions', 'Smoke', 'Bills & utilities', 'EMI',
  'Shopping', 'Medical', 'Entertainment', 'Transport',
  'Investment / SIP', 'Other'
];

export const CATEGORY_COLORS: Record<string, string> = {
  'Rent': '#a855f7', 'Groceries': '#22c55e', 'Petrol': '#f59e0b',
  'Zomato / Swiggy': '#f97316', 'Eating out': '#ec4899',
  'Subscriptions': '#3b82f6', 'Smoke': '#84cc16', 'Bills & utilities': '#8b5cf6',
  'EMI': '#14b8a6', 'Shopping': '#f43f5e', 'Medical': '#ef4444',
  'Entertainment': '#fb923c', 'Transport': '#94a3b8',
  'Investment / SIP': '#06b6d4', 'Other': '#6b7280'
};
