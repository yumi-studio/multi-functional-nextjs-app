"use client";

import { DBSchema } from "idb";

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  currency: string;
  accountId: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  accountId: string;
  createdAt: string;
}

export interface WishItem {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  accountId: string;
  createdAt: string;
}

export interface FamFinDB extends DBSchema {
  wallets: {
    key: string;
    value: Wallet;
  };
  transactions: {
    key: string;
    value: Transaction;
  };
  wishItems: {
    key: string;
    value: WishItem;
  };
}
