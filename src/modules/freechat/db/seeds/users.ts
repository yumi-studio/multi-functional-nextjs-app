import { seed } from "drizzle-seed";
import { usersTable } from '@/modules/freechat/db/schema';
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import { encryptPassword } from "@/modules/freechat/services/user.service";

export default async function seedUsers(db: PostgresJsDatabase) {
  await db.execute(sql`TRUNCATE TABLE ${usersTable}`);
  const saPassword = process.env.FREECHAT_SA_PASSWORD ?? '@Admin123';
  const userPassword = saPassword;
  const hashedSaPassword = await encryptPassword(saPassword);
  const hashedPassword = await encryptPassword(userPassword);

  await db.insert(usersTable).values({
    id: '00000000-0000-0000-0000-000000000000',
    displayName: 'Super Admin',
    email: process.env.FREECHAT_SA_EMAIL!,
    passwordHash: hashedSaPassword,
  }).execute();

  await seed(db, { usersTable }, { count: 20, seed: 9999, }).refine((f) => ({
    usersTable: {
      columns: {
        avatarUrl: f.default({ defaultValue: null }),
        passwordHash: f.default({ defaultValue: hashedPassword })
      },
    }
  }));
}
