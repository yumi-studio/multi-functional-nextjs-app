"use client";

import { DBSchema } from "idb";

export type BackupMethod = 'google';

export interface Backup {
  method: BackupMethod | null;
  version: number | null;
  google: GoogleBkp | null;
}

export interface GoogleBkp {
  active: false;
  id: string;
}

export interface BackupDB extends DBSchema {
  backup: {
    key: string,
    value: Backup | null,
  }
}
