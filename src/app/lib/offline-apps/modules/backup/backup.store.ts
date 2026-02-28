"use client";

import { create } from "zustand";
import { getDB } from "../../database/indexdb";
import { Backup } from "./backup.schema";

interface BackupStore {
  currentBackup: Backup | null;
  isInitialized: boolean,
  initDB: () => Promise<void>;
  setCurrentBackup: (account: Backup | null) => Promise<void>;
  getBackupByAccountId: (id: string) => Promise<Backup | null>;
}

export const useBackupStore = create<BackupStore>((set, get) => {
  return {
    currentBackup: null,
    isInitialized: false,
    initDB: async () => {
      if (typeof window === 'undefined') return;

      try {
        const database = await getDB();

        const currentTx = database.transaction('backup', 'readwrite');
        const currentStore = currentTx.objectStore('backup');
        const currentBackup = await currentStore.get('current');

        set({
          currentBackup: currentBackup || null,
          isInitialized: true,
        });

      } catch (error) {
        console.error('Error initializing Backup DB:', error);
        set({ isInitialized: true });
      }
    },
    setCurrentBackup: async (account: Backup | null) => {
      try {
        const database = await getDB();
        const tx = database.transaction('backup', 'readwrite');

        if (account) {
          await tx.objectStore('backup').put(account, 'current');
        } else {
          await tx.objectStore('backup').delete('current');
        }

        set({
          currentBackup: account || null,
        });
      } catch (err) {
        console.error('Error setCurrentBackup:', err);
      }
    },
    getBackupByAccountId: async (id: string) => {
      try {
        const database = await getDB();
        const tx = database.transaction('backup', 'readonly');
        const backup = await tx.objectStore('backup').get(id);

        return backup ?? null;
      } catch (err) {
        console.error('Error setCurrentBackup:', err);
        return null;
      }
    }
  }
})
