"use server";

import { count, desc, eq } from "drizzle-orm";

import { db } from "../db";
import { conversationsTable, InsertConversation, SelectConversation } from "../db/schema";

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
    return [] as SelectConversation[];
  }
};

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
