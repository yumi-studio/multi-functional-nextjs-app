"use client";

import { deleteDB, IDBPDatabase, openDB } from "idb";
import { OfflineDB } from "@/app/lib/offline-apps/database/schema";
import { migrateAccountDB } from "../modules/account/account.migration";
import { migrateFamFinDB } from "../modules/famfin/famfin.migration";

export const DB_NAME = process.env.NEXT_PUBLIC_INDEXDB_OFFLINE_NAME ?? "default_offline";
export const DB_VERSION = 2;

let dbInstance: IDBPDatabase<OfflineDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<OfflineDB>> {
  if (!dbInstance) {
    dbInstance = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        migrateAccountDB(db, oldVersion);
        migrateFamFinDB(db, oldVersion);
      },
    });
  }

  return dbInstance;
}

export async function resetDB() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }

  await deleteDB(DB_NAME)
}
