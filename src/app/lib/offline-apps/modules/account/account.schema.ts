"use client";

import { DBSchema } from "idb";

export interface OfflineAccount {
  id: string;
  username: string;
  password: string;
  avatar: string | null;
  createdAt: string;
}

export interface AccountDB extends DBSchema {
  accounts: {
    key: string;
    value: OfflineAccount;
  };
  currentAccount: {
    key: string;
    value: OfflineAccount | null;
  };
}
