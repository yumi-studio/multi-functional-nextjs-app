"use client";

import { DBSchema } from "idb";
import { AccountDB, OfflineAccount } from "../modules/account/account.schema";
import { FamFinDB, Transaction, Wallet, WishItem } from "../modules/famfin/famfin.schema";
import { BackupDB } from "../modules/backup/backup.schema";

export interface OfflineDB extends AccountDB, FamFinDB, BackupDB {
}

export interface OfflineBackup {
  account: OfflineAccount,

  famfin_wallets: Wallet[],
  famfin_transactions: Transaction[],
  famfin_wishItems: WishItem[],
}
