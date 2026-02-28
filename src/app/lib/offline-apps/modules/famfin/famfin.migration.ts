"use client";

import { IDBPDatabase } from "idb";
import { OfflineDB } from "@/app/lib/offline-apps/database/schema";

export const FAMFIN_VERSION = 1;

export function migrateFamFinDB(db: IDBPDatabase<OfflineDB>, oldVersion: number) {
  if (oldVersion < FAMFIN_VERSION) {
    if (!db.objectStoreNames.contains('wallets')) {
      db.createObjectStore('wallets', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('transactions')) {
      db.createObjectStore('transactions', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('wishItems')) {
      db.createObjectStore('wishItems', { keyPath: 'id' });
    }
  }
}
