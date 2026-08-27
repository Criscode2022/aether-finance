export type TransactionType = 'INCOME' | 'EXPENSE';
export type BudgetPeriod = 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface UserDto {
  id: string;
  email: string;
  name: string | null;
}

export interface CategoryDto {
  id: string;
  name: string;
  color: string;
  icon?: string | null;
}

export interface TransactionDto {
  id: string;
  amount: number;
  type: TransactionType;
  description?: string | null;
  date: string;
  categoryId?: string | null;
  category?: CategoryDto | null;
}

export interface BudgetDto {
  id: string;
  amount: number;
  period: BudgetPeriod;
  startDate: string;
  categoryId?: string | null;
  category?: CategoryDto | null;
}

export interface AuthResponse {
  accessToken: string;
  user: UserDto;
}

export interface SummaryDto {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
