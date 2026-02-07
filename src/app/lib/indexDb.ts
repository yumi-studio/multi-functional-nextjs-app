"use client";

import { openDB } from 'idb';

export const INDEXDB_NAME = process.env.NEXT_PUBLIC_INDEXDB_NAME ?? 'default';

export const STORE_USER = 'user';

const dbPromise = () => {
  return openDB(INDEXDB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_USER);
    },
  });
}

export const userIdb = {
  async get(key: string) {
    return await dbPromise().then(db => db.get('user', key));
  },
  async set(key: string, value: any) {
    return await dbPromise().then(db => db.put('user', value, key));
  },
  async clear(key: string) {
    return await dbPromise().then(db => db.delete('user', key));
  },
}
