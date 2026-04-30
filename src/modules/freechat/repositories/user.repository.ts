import 'server-only';
import { count, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/modules/freechat/db";
import { InsertUser, SelectUser, usersTable } from "@/modules/freechat/db/schema";

type UserIdOnly = Pick<SelectUser, "id">;
type UpdateUser = Partial<Omit<InsertUser, "id" | "createdAt">>;

export const createOne = async (data: InsertUser) => {
  const ids = await createMany([data]);
  return ids.length === 0 ? null : ids[0].id;
};

export const createMany = async (data: InsertUser[]) => {
  if (data.length === 0) {
    return [] as UserIdOnly[];
  }

  try {
    return await db.insert(usersTable).values(data).returning({ id: usersTable.id });
  } catch {
    return [] as UserIdOnly[];
  }
};

export const getAll = async () => {
  try {
    return await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
  } catch {
    return [] as SelectUser[];
  }
};

export const getCount = async () => {
  try {
    const [result] = await db.select({ count: count() }).from(usersTable);
    return result?.count ?? 0;
  } catch {
    return 0;
  }
};

export const getById = async (id: string) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
    return user ?? null;
  } catch {
    return null;
  }
};

export const getManyById = async (ids: string[]) => {
  try {
    const users = await db.select().from(usersTable).where(inArray(usersTable.id, ids)).execute();
    return users ?? [];
  } catch {
    return [];
  }
};

export const getByEmail = async (email: string) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    return user ?? null;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
    } else {
      console.error('Database error', err);
    }
    return null;
  }
};

export const existsById = async (id: string) => {
  return (await getById(id)) !== null;
};

export const existsByEmail = async (email: string) => {
  return (await getByEmail(email)) !== null;
};

export const updateById = async (id: string, data: UpdateUser) => {
  if (Object.keys(data).length === 0) {
    return null;
  }

  try {
    const [user] = await db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning();

    return user ?? null;
  } catch {
    return null;
  }
};

export const deleteById = async (id: string) => {
  try {
    const [user] = await db.delete(usersTable).where(eq(usersTable.id, id)).returning();
    return user ?? null;
  } catch {
    return null;
  }
};
