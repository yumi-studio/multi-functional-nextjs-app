"use client";

import { IDBPDatabase } from "idb";
import { OfflineDB } from "../../database/schema";

export const BACKUPSCHEMA_VERSION = 4;

export function migrateBackupDB(db: IDBPDatabase<OfflineDB>, oldVersion: number) {
  if (oldVersion < BACKUPSCHEMA_VERSION) {
    if (!db.objectStoreNames.contains('backup')) {
      db.createObjectStore('backup', { keyPath: 'id' });
    }
  }
}
