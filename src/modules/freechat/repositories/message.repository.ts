import 'server-only';
import { and, count, desc, eq, isNull } from "drizzle-orm";
import { db } from "../db";
import { InsertMessage, messagesTable, SelectMessage } from "../db/schema";

type MessageIdOnly = Pick<SelectMessage, "id">;
type UpdateMessage = Partial<Omit<InsertMessage, "id" | "createdAt">>;

export const createOne = async (data: InsertMessage) => {
  const ids = await createMany([data]);
  return ids.length === 0 ? null : ids[0].id;
};

export const createMany = async (data: InsertMessage[]) => {
  if (data.length === 0) {
    return [] as MessageIdOnly[];
  }

  try {
    return await db.insert(messagesTable).values(data).returning({ id: messagesTable.id });
  } catch {
    return [] as MessageIdOnly[];
  }
};

export const getAll = async () => {
  try {
    return await db.select().from(messagesTable).orderBy(desc(messagesTable.createdAt));
  } catch {
    return [] as SelectMessage[];
  }
};

export const getCount = async () => {
  try {
    const [result] = await db.select({ count: count() }).from(messagesTable);
    return result?.count ?? 0;
  } catch {
    return 0;
  }
};

export const getById = async (id: string) => {
  try {
    const [message] = await db.select().from(messagesTable).where(eq(messagesTable.id, id)).limit(1);
    return message ?? null;
  } catch {
    return null;
  }
};

export const getByConversationId = async (conversationId: string) => {
  try {
    return await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.conversationId, conversationId))
      .orderBy(desc(messagesTable.createdAt));
  } catch {
    return [] as SelectMessage[];
  }
};

export const getActiveByConversationId = async (conversationId: string) => {
  try {
    return await db
      .select()
      .from(messagesTable)
      .where(and(eq(messagesTable.conversationId, conversationId), isNull(messagesTable.deletedAt)))
      .orderBy(desc(messagesTable.createdAt));
  } catch {
    return [] as SelectMessage[];
  }
};

export const getByUserId = async (userId: string) => {
  try {
    return await db.select().from(messagesTable).where(eq(messagesTable.userId, userId)).orderBy(desc(messagesTable.createdAt));
  } catch {
    return [] as SelectMessage[];
  }
};

export const getByReplyMessageId = async (replyMessageId: string) => {
  try {
    return await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.replyMessageId, replyMessageId))
      .orderBy(desc(messagesTable.createdAt));
  } catch {
    return [] as SelectMessage[];
  }
};

export const existsById = async (id: string) => {
  return (await getById(id)) !== null;
};

export const updateById = async (id: string, data: UpdateMessage) => {
  if (Object.keys(data).length === 0) {
    return null;
  }

  try {
    const [message] = await db
      .update(messagesTable)
      .set(data)
      .where(eq(messagesTable.id, id))
      .returning();

    return message ?? null;
  } catch {
    return null;
  }
};

export const deleteById = async (id: string) => {
  try {
    const [message] = await db.delete(messagesTable).where(eq(messagesTable.id, id)).returning();
    return message ?? null;
  } catch {
    return null;
  }
};

export const softDeleteById = async (id: string) => {
  try {
    const [message] = await db
      .update(messagesTable)
      .set({ deletedAt: new Date() })
      .where(eq(messagesTable.id, id))
      .returning();

    return message ?? null;
  } catch {
    return null;
  }
};
