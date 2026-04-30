import 'server-only';
import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/modules/freechat/db";
import { InsertParticipant, participantsTable, SelectParticipant } from "@/modules/freechat/db/schema";
import { cache } from 'react';

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

export const getByConversationId = async (conversationId: string): Promise<SelectParticipant[]> => {
  try {
    return await db
      .select()
      .from(participantsTable)
      .where(eq(participantsTable.conversationId, conversationId))
      .orderBy(desc(participantsTable.joinedAt))
  } catch {
    return [];
  }
}

export const getUserIdsByConversationId = async (conversationId: string): Promise<string[]> => {
  try {
    const participants = await db
      .select()
      .from(participantsTable)
      .where(eq(participantsTable.conversationId, conversationId));
    return participants.map(p => p.userId);
  } catch {
    return [];
  }
}

export const getByUserId = async (userId: string): Promise<SelectParticipant[]> => {
  try {
    return await db
      .select()
      .from(participantsTable)
      .where(eq(participantsTable.userId, userId))
      .orderBy(desc(participantsTable.joinedAt));
  } catch {
    return [];
  }
};

export const getByConversationIdAndUserId = async (conversationId: string, userId: string): Promise<SelectParticipant | null> => {
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

export const existsById = async (id: string): Promise<boolean> => {
  return (await getById(id)) !== null;
};

export const existsByConversationIdAndUserId = async (conversationId: string, userId: string): Promise<boolean> => {
  return (await getByConversationIdAndUserId(conversationId, userId)) !== null;
};

export const updateById = async (id: string, data: UpdateParticipant): Promise<SelectParticipant | null> => {
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

export const deleteById = async (id: string): Promise<SelectParticipant | null> => {
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

export const deleteByConversationId = async (conversationId: string): Promise<SelectParticipant[]> => {
  try {
    return await db
      .delete(participantsTable)
      .where(eq(participantsTable.conversationId, conversationId))
      .returning();
  } catch {
    return [];
  }
};
