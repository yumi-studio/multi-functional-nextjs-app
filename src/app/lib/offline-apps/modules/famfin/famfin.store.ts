"use client";

import { create } from "zustand";
import { getDB } from "../../database/indexdb";
import { Wallet, Transaction, WishItem } from "./famfin.schema";


interface FamFinStore {
  wallets: Wallet[];
  transactions: Transaction[];
  wishItems: WishItem[];
  isInitialized: boolean;
  initDB: () => Promise<void>;

  // Wallet operations
  createWallet: (name: string, currency: string, accountId: string) => Promise<void>;
  addMoneyToWallet: (walletId: string, amount: number, description: string) => Promise<void>;
  withdrawMoneyFromWallet: (walletId: string, amount: number, description: string) => Promise<void>;
  getWalletById: (walletId: string) => Wallet | undefined;
  deleteWallet: (walletId: string) => Promise<void>;

  // Transaction operations
  getTransactionsByWallet: (walletId: string) => Transaction[];
  getTransactionsByAccountId: (accountId: string) => Transaction[];
  deleteTransaction: (transactionId: string) => Promise<void>;

  // Wish item operations
  createWishItem: (name: string, targetAmount: number, category: string, priority: 'low' | 'medium' | 'high', accountId: string, dueDate?: string) => Promise<void>;
  addToWishItem: (wishItemId: string, amount: number) => Promise<void>;
  deleteWishItem: (wishItemId: string) => Promise<void>;
  updateWishItem: (wishItemId: string, updates: Partial<WishItem>) => Promise<void>;
  getWishItemsByAccountId: (accountId: string) => WishItem[];
}

export const useFamFinStore = create<FamFinStore>((set, get) => {
  return {
    wallets: [],
    transactions: [],
    wishItems: [],
    isInitialized: false,

    initDB: async () => {
      if (typeof window === 'undefined') return;

      try {
        const database = await getDB();

        // Load wallets
        const walletsTx = database.transaction('wallets', 'readonly');
        const walletsStore = walletsTx.objectStore('wallets');
        const allWallets = await walletsStore.getAll();

        // Load transactions
        const transactionsTx = database.transaction('transactions', 'readonly');
        const transactionsStore = transactionsTx.objectStore('transactions');
        const allTransactions = await transactionsStore.getAll();

        // Load wish items
        const wishItemsTx = database.transaction('wishItems', 'readonly');
        const wishItemsStore = wishItemsTx.objectStore('wishItems');
        const allWishItems = await wishItemsStore.getAll();

        set({
          wallets: allWallets,
          transactions: allTransactions,
          wishItems: allWishItems,
          isInitialized: true,
        });
      } catch (error) {
        console.error('Error initializing FamFin DB:', error);
        set({ isInitialized: true });
      }
    },

    createWallet: async (name: string, currency: string, accountId: string) => {
      try {
        const database = await getDB();
        const wallet: Wallet = {
          id: Date.now().toString(),
          name,
          balance: 0,
          currency,
          accountId,
          createdAt: new Date().toISOString(),
        };

        const tx = database.transaction('wallets', 'readwrite');
        await tx.objectStore('wallets').add(wallet);

        set((state) => ({
          wallets: [...state.wallets, wallet],
        }));
      } catch (error) {
        console.error('Error creating wallet:', error);
      }
    },

    addMoneyToWallet: async (walletId: string, amount: number, description: string) => {
      try {
        const database = await getDB();
        const walletsStore = database.transaction('wallets', 'readwrite').objectStore('wallets');
        const wallet = await walletsStore.get(walletId);

        if (wallet) {
          const updatedWallet = { ...wallet, balance: wallet.balance + amount };
          await walletsStore.put(updatedWallet);

          // Create transaction record
          const transaction: Transaction = {
            id: Date.now().toString(),
            walletId,
            type: 'income',
            amount,
            description,
            category: 'Income',
            date: new Date().toLocaleDateString('vi-VN'),
            accountId: wallet.accountId,
            createdAt: new Date().toISOString(),
          };

          const transactionsTx = database.transaction('transactions', 'readwrite');
          await transactionsTx.objectStore('transactions').add(transaction);

          set((state) => ({
            wallets: state.wallets.map((w) => (w.id === walletId ? updatedWallet : w)),
            transactions: [...state.transactions, transaction],
          }));
        }
      } catch (error) {
        console.error('Error adding money to wallet:', error);
      }
    },

    withdrawMoneyFromWallet: async (walletId: string, amount: number, description: string) => {
      try {
        const database = await getDB();
        const walletsStore = database.transaction('wallets', 'readwrite').objectStore('wallets');
        const wallet = await walletsStore.get(walletId);

        if (wallet && wallet.balance >= amount) {
          const updatedWallet = { ...wallet, balance: wallet.balance - amount };
          await walletsStore.put(updatedWallet);

          // Create transaction record
          const transaction: Transaction = {
            id: Date.now().toString(),
            walletId,
            type: 'expense',
            amount,
            description,
            category: 'Withdraw',
            date: new Date().toLocaleDateString('vi-VN'),
            accountId: wallet.accountId,
            createdAt: new Date().toISOString(),
          };

          const transactionsTx = database.transaction('transactions', 'readwrite');
          await transactionsTx.objectStore('transactions').add(transaction);

          set((state) => ({
            wallets: state.wallets.map((w) => (w.id === walletId ? updatedWallet : w)),
            transactions: [...state.transactions, transaction],
          }));
        }
      } catch (error) {
        console.error('Error withdrawing money from wallet:', error);
      }
    },

    getWalletById: (walletId: string) => {
      return get().wallets.find((w) => w.id === walletId);
    },

    deleteWallet: async (walletId: string) => {
      try {
        const database = await getDB();
        const tx = database.transaction('wallets', 'readwrite');
        await tx.objectStore('wallets').delete(walletId);

        set((state) => ({
          wallets: state.wallets.filter((w) => w.id !== walletId),
        }));
      } catch (error) {
        console.error('Error deleting wallet:', error);
      }
    },

    getTransactionsByWallet: (walletId: string) => {
      return get().transactions.filter((t) => t.walletId === walletId);
    },

    getTransactionsByAccountId: (accountId: string) => {
      return get().transactions.filter((t) => t.accountId === accountId);
    },

    deleteTransaction: async (transactionId: string) => {
      try {
        const database = await getDB();
        const tx = database.transaction('transactions', 'readwrite');
        await tx.objectStore('transactions').delete(transactionId);

        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== transactionId),
        }));
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    },

    createWishItem: async (
      name: string,
      targetAmount: number,
      category: string,
      priority: 'low' | 'medium' | 'high',
      accountId: string,
      dueDate?: string
    ) => {
      try {
        const database = await getDB();
        const wishItem: WishItem = {
          id: Date.now().toString(),
          name,
          targetAmount,
          currentAmount: 0,
          category,
          priority,
          dueDate: dueDate || null,
          accountId,
          createdAt: new Date().toISOString(),
        };

        const tx = database.transaction('wishItems', 'readwrite');
        await tx.objectStore('wishItems').add(wishItem);

        set((state) => ({
          wishItems: [...state.wishItems, wishItem],
        }));
      } catch (error) {
        console.error('Error creating wish item:', error);
      }
    },

    addToWishItem: async (wishItemId: string, amount: number) => {
      try {
        const database = await getDB();
        const tx = database.transaction('wishItems', 'readwrite');
        const wishItem = await tx.objectStore('wishItems').get(wishItemId);

        if (wishItem) {
          const updatedWishItem = {
            ...wishItem,
            currentAmount: Math.min(wishItem.currentAmount + amount, wishItem.targetAmount),
          };
          await tx.objectStore('wishItems').put(updatedWishItem);

          set((state) => ({
            wishItems: state.wishItems.map((w) => (w.id === wishItemId ? updatedWishItem : w)),
          }));
        }
      } catch (error) {
        console.error('Error adding to wish item:', error);
      }
    },

    deleteWishItem: async (wishItemId: string) => {
      try {
        const database = await getDB();
        const tx = database.transaction('wishItems', 'readwrite');
        await tx.objectStore('wishItems').delete(wishItemId);

        set((state) => ({
          wishItems: state.wishItems.filter((w) => w.id !== wishItemId),
        }));
      } catch (error) {
        console.error('Error deleting wish item:', error);
      }
    },

    updateWishItem: async (wishItemId: string, updates: Partial<WishItem>) => {
      try {
        const database = await getDB();
        const tx = database.transaction('wishItems', 'readwrite');
        const wishItem = await tx.objectStore('wishItems').get(wishItemId);

        if (wishItem) {
          const updatedWishItem = { ...wishItem, ...updates };
          await tx.objectStore('wishItems').put(updatedWishItem);

          set((state) => ({
            wishItems: state.wishItems.map((w) => (w.id === wishItemId ? updatedWishItem : w)),
          }));
        }
      } catch (error) {
        console.error('Error updating wish item:', error);
      }
    },

    getWishItemsByAccountId: (accountId: string) => {
      return get().wishItems.filter((w) => w.accountId === accountId);
    },
  };
});
