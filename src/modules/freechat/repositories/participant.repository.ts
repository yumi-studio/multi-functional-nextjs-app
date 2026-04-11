import 'server-only';
import { and, count, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { InsertParticipant, participantsTable, SelectParticipant } from "../db/schema";

type ParticipantIdOnly = Pick<SelectParticipant, "id">;
type UpdateParticipant = Partial<Omit<InsertParticipant, "id" | "createdAt">>;

export const createOne = async (data: InsertParticipant) => {
  const ids = await createMany([data]);
  return ids.length === 0 ? null : ids[0].id;
};

export const createMany = async (data: InsertParticipant[]) => {
  if (data.length === 0) {
    return [] as ParticipantIdOnly[];
  }

  try {
    return await db.insert(participantsTable).values(data).returning({ id: participantsTable.id });
  } catch {
    return [] as ParticipantIdOnly[];
  }
};

export const getAll = async () => {
  try {
    return await db.select().from(participantsTable).orderBy(desc(participantsTable.joinedAt));
  } catch {
    return [] as SelectParticipant[];
  }
};

export const getCount = async () => {
  try {
    const [result] = await db.select({ count: count() }).from(participantsTable);
    return result?.count ?? 0;
  } catch {
    return 0;
  }
};

export const getById = async (id: string) => {
  try {
    const [participant] = await db
      .select()
      .from(participantsTable)
      .where(eq(participantsTable.id, id))
      .limit(1);

    return participant ?? null;
  } catch {
    return null;
  }
};

export const getByConversationId = async (conversationId: string) => {
  try {
    return await db
      .select()
      .from(participantsTable)
      .where(eq(participantsTable.conversationId, conversationId))
      .orderBy(desc(participantsTable.joinedAt));
  } catch {
    return [] as SelectParticipant[];
  }
};

export const getByUserId = async (userId: string) => {
  try {
    return await db
      .select()
      .from(participantsTable)
      .where(eq(participantsTable.userId, userId))
      .orderBy(desc(participantsTable.joinedAt));
  } catch {
    return [] as SelectParticipant[];
  }
};

export const getByConversationIdAndUserId = async (conversationId: string, userId: string) => {
  try {
    const [participant] = await db
      .select()
      .from(participantsTable)
      .where(and(eq(participantsTable.conversationId, conversationId), eq(participantsTable.userId, userId)))
      .limit(1);

    return participant ?? null;
  } catch {
    return null;
  }
};

export const existsById = async (id: string) => {
  return (await getById(id)) !== null;
};

export const existsByConversationIdAndUserId = async (conversationId: string, userId: string) => {
  return (await getByConversationIdAndUserId(conversationId, userId)) !== null;
};

export const updateById = async (id: string, data: UpdateParticipant) => {
  if (Object.keys(data).length === 0) {
    return null;
  }

  try {
    const [participant] = await db
      .update(participantsTable)
      .set(data)
      .where(eq(participantsTable.id, id))
      .returning();

    return participant ?? null;
  } catch {
    return null;
  }
};

export const deleteById = async (id: string) => {
  try {
    const [participant] = await db
      .delete(participantsTable)
      .where(eq(participantsTable.id, id))
      .returning();

    return participant ?? null;
  } catch {
    return null;
  }
};

export const deleteByConversationId = async (conversationId: string) => {
  try {
    return await db
      .delete(participantsTable)
      .where(eq(participantsTable.conversationId, conversationId))
      .returning();
  } catch {
    return [] as SelectParticipant[];
  }
};
