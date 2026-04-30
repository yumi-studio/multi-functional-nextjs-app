import 'server-only';
import { count, desc, eq, inArray, sql } from "drizzle-orm";

import { db } from "@/modules/freechat/db";
import { conversationsTable, InsertConversation, participantsTable, SelectConversation } from "@/modules/freechat/db/schema";
import { PgSelectBuilder, PgSelectQueryBuilderBase, SelectedFields } from 'drizzle-orm/pg-core';

type ConversationIdOnly = Pick<SelectConversation, "id">;
type UpdateConversation = Partial<Omit<InsertConversation, "id" | "createdAt">>;

export const createOne = async (data: InsertConversation) => {
  const ids = await createMany([data]);
  return ids.length === 0 ? null : ids[0].id;
};

export const createMany = async (data: InsertConversation[]) => {
  if (data.length === 0) {
    return [] as ConversationIdOnly[];
  }

  try {
    return await db.insert(conversationsTable).values(data).returning({ id: conversationsTable.id });
  } catch {
    return [] as ConversationIdOnly[];
  }
};

export const getAll = async () => {
  try {
    return await db.select().from(conversationsTable).orderBy(desc(conversationsTable.createdAt));
  } catch {
    return [];
  }
};

export const getAllByUser = async (userId: string) => {
  try {
    const query = db.select()
      .from(conversationsTable)
      .where(
        inArray(
          conversationsTable.id,
          sql`(select conversation_id from ${participantsTable} where ${participantsTable.userId} = ${userId})`
        )
      )
      .orderBy(desc(conversationsTable.createdAt));

    // console.log(`[INFO] Query: ${query.$dynamic().toSQL().sql}`);

    return await query.execute();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// export const getByPagination = (filters: { field: string, value: any }[] = [], page = 1, limit = 20) => {
//   let query = db.select().from(conversationsTable).$dynamic;
//   filters.map(filter => query.w)
//   return
// }

export const getCount = async () => {
  try {
    const [result] = await db.select({ count: count() }).from(conversationsTable);
    return result?.count ?? 0;
  } catch {
    return 0;
  }
};

export const getById = async (id: string) => {
  try {
    const [conversation] = await db
      .select()
      .from(conversationsTable)
      .where(eq(conversationsTable.id, id))
      .limit(1);

    return conversation ?? null;
  } catch {
    return null;
  }
};

export const existsById = async (id: string) => {
  return (await getById(id)) !== null;
};

export const updateById = async (id: string, data: UpdateConversation) => {
  if (Object.keys(data).length === 0) {
    return null;
  }

  try {
    const [conversation] = await db
      .update(conversationsTable)
      .set(data)
      .where(eq(conversationsTable.id, id))
      .returning();

    return conversation ?? null;
  } catch {
    return null;
  }
};

export const deleteById = async (id: string) => {
  try {
    const [conversation] = await db
      .delete(conversationsTable)
      .where(eq(conversationsTable.id, id))
      .returning();

    return conversation ?? null;
  } catch {
    return null;
  }
};
