import { seed } from "drizzle-seed";
import { usersTable } from '../schema';
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import bcrypt from 'bcrypt';
import { sql } from "drizzle-orm";

function hashPassword(password: string) {
  return bcrypt.hashSync(password, parseInt(`${process.env.FREECHAT_PASSWORD_ENCRYPT_SALT!}`))
}

export default async function seedUsers(db: PostgresJsDatabase) {
  await db.execute(sql`TRUNCATE TABLE ${usersTable}`);

  await db.insert(usersTable).values({
    id: '00000000-0000-0000-0000-000000000000',
    displayName: 'Super Admin',
    email: process.env.FREECHAT_SA_EMAIL!,
    passwordHash: hashPassword(process.env.FREECHAT_SA_PASSW!),
  }).execute();

  await seed(db, { usersTable }, { count: 20, seed: 9999, }).refine((f) => ({
    usersTable: {
      columns: {
        avatarUrl: f.default({ defaultValue: null }),
        passwordHash: f.default({ defaultValue: hashPassword(process.env.FREECHAT_SA_PASSW!) })
      },
    }
  }));
}
