"use client";

import { IDBPDatabase } from "idb";
import { OfflineDB } from "@/app/lib/offline-apps/database/schema";

export const ACCOUNT_VERSION = 1;

export function migrateAccountDB(db: IDBPDatabase<OfflineDB>, oldVersion: number) {
  if (oldVersion < ACCOUNT_VERSION) {
    if (!db.objectStoreNames.contains('accounts')) {
      db.createObjectStore('accounts', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('currentAccount')) {
      db.createObjectStore('currentAccount');
    }
  }
}
