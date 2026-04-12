import { seed } from "drizzle-seed";
import { usersTable } from '../schema';
import { db } from '..';

export default async function seedUsers() {
  await seed(db, { usersTable }, { count: 100, seed: 9999, });
}