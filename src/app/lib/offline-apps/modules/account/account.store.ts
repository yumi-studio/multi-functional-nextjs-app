"use client";

import { create } from "zustand";
import { getDB } from "../../database/indexdb";
import { OfflineAccount } from "./account.schema";


interface AccountStore {
  accounts: OfflineAccount[];
  currentAccount: OfflineAccount | null;
  isInitialized: boolean;
  initDB: () => Promise<void>;
  addAccount: (account: OfflineAccount) => Promise<void>;
  setCurrentAccount: (account: OfflineAccount | null) => Promise<void>;
  updateAccount: (id: string, updates: Partial<OfflineAccount>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAccountStore = create<AccountStore>((set, get) => {
  return {
    accounts: [],
    currentAccount: null,
    isInitialized: false,

    initDB: async () => {
      if (typeof window === 'undefined') return;

      try {
        const database = await getDB();

        // Load accounts from IndexDB
        const accountsTx = database.transaction('accounts', 'readonly');
        const accountsStore = accountsTx.objectStore('accounts');
        const allAccounts = await accountsStore.getAll();

        // Load current account from IndexDB
        const currentTx = database.transaction('currentAccount', 'readonly');
        const currentStore = currentTx.objectStore('currentAccount');
        const currentAccount = await currentStore.get('current');

        set({
          accounts: allAccounts,
          currentAccount: currentAccount || null,
          isInitialized: true,
        });
      } catch (error) {
        console.error('Error initializing IndexDB:', error);
        set({ isInitialized: true });
      }
    },

    addAccount: async (account: OfflineAccount) => {
      try {
        const database = await getDB();
        const tx = database.transaction('accounts', 'readwrite');
        await tx.objectStore('accounts').add(account);

        set((state) => ({
          accounts: [...state.accounts, account],
        }));
      } catch (error) {
        console.error('Error adding account:', error);
      }
    },

    setCurrentAccount: async (account: OfflineAccount | null) => {
      try {
        const database = await getDB();
        const tx = database.transaction('currentAccount', 'readwrite');

        if (account) {
          await tx.objectStore('currentAccount').put(account, 'current');
        } else {
          await tx.objectStore('currentAccount').delete('current');
        }

        set({ currentAccount: account });
      } catch (error) {
        console.error('Error setting current account:', error);
      }
    },

    updateAccount: async (id: string, updates: Partial<OfflineAccount>) => {
      try {
        const database = await getDB();
        const tx = database.transaction('accounts', 'readwrite');
        const store = tx.objectStore('accounts');

        const account = await store.get(id);
        if (account) {
          const updatedAccount = { ...account, ...updates };
          await store.put(updatedAccount);

          set((state) => ({
            accounts: state.accounts.map((acc) =>
              acc.id === id ? updatedAccount : acc
            ),
          }));
        }
      } catch (error) {
        console.error('Error updating account:', error);
      }
    },

    deleteAccount: async (id: string) => {
      try {
        const database = await getDB();
        const tx = database.transaction('accounts', 'readwrite');
        await tx.objectStore('accounts').delete(id);

        set((state) => ({
          accounts: state.accounts.filter((acc) => acc.id !== id),
        }));
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    },

    logout: async () => {
      try {
        const database = await getDB();
        const tx = database.transaction('currentAccount', 'readwrite');
        await tx.objectStore('currentAccount').delete('current');

        set({ currentAccount: null });
      } catch (error) {
        console.error('Error logging out:', error);
      }
    },
  };
});
