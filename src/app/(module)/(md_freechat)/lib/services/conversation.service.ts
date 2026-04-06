"use server";

import { and, eq, inArray } from "drizzle-orm";

import { db } from "../db";
import { conversationsTable, participantsTable } from "../db/schema";
import type { Conversation, Message, Participant } from "../types";
import * as conversationRepository from "../repositories/conversation.repository";
import * as messageService from "./message.service";

const normalizeUserIds = (userIds: string[]) => {
  return [...new Set(userIds.map((userId) => userId.trim()).filter(Boolean))];
};

export const createConversation = async ({
  name,
  avatarUrl,
  participantUserIds,
}: {
  name: string;
  avatarUrl?: string | null;
  participantUserIds: string[];
}): Promise<{ conversation: Conversation; participants: Participant[] } | null> => {
  const normalizedName = name.trim();
  const normalizedUserIds = normalizeUserIds(participantUserIds);

  if (!normalizedName || normalizedUserIds.length === 0) {
    return null;
  }

  try {
    return await db.transaction(async (tx) => {
      const [conversation] = await tx
        .insert(conversationsTable)
        .values({
          name: normalizedName,
          avatarUrl: avatarUrl?.trim() || null,
        })
        .returning();

      const participants = await tx
        .insert(participantsTable)
        .values(
          normalizedUserIds.map((userId) => ({
            conversationId: conversation.id,
            userId,
            role: "member",
          }))
        )
        .returning();

      return { conversation, participants };
    });
  } catch {
    return null;
  }
};

export const addUsersToConversation = async ({
  conversationId,
  userIds,
  role = "member",
}: {
  conversationId: string;
  userIds: string[];
  role?: string;
}): Promise<Participant[]> => {
  const normalizedConversationId = conversationId.trim();
  const normalizedUserIds = normalizeUserIds(userIds);

  if (!normalizedConversationId || normalizedUserIds.length === 0) {
    return [];
  }

  try {
    return await db.transaction(async (tx) => {
      const [conversation] = await tx
        .select({ id: conversationsTable.id })
        .from(conversationsTable)
        .where(eq(conversationsTable.id, normalizedConversationId))
        .limit(1);

      if (!conversation) {
        return [] as Participant[];
      }

      const existingParticipants = await tx
        .select({ userId: participantsTable.userId })
        .from(participantsTable)
        .where(
          and(
            eq(participantsTable.conversationId, normalizedConversationId),
            inArray(participantsTable.userId, normalizedUserIds)
          )
        );

      const existingUserIds = new Set(existingParticipants.map((participant) => participant.userId));
      const missingUserIds = normalizedUserIds.filter((userId) => !existingUserIds.has(userId));

      if (missingUserIds.length === 0) {
        return [] as Participant[];
      }

      return await tx
        .insert(participantsTable)
        .values(
          missingUserIds.map((userId) => ({
            conversationId: normalizedConversationId,
            userId,
            role,
          }))
        )
        .returning();
    });
  } catch {
    return [];
  }
};

export const removeUsersFromConversation = async ({
  conversationId,
  userIds,
}: {
  conversationId: string;
  userIds: string[];
}): Promise<Participant[]> => {
  const normalizedConversationId = conversationId.trim();
  const normalizedUserIds = normalizeUserIds(userIds);

  if (!normalizedConversationId || normalizedUserIds.length === 0) {
    return [];
  }

  try {
    return await db
      .delete(participantsTable)
      .where(
        and(
          eq(participantsTable.conversationId, normalizedConversationId),
          inArray(participantsTable.userId, normalizedUserIds)
        )
      )
      .returning();
  } catch {
    return [];
  }
};

export const saveNewMessage = async ({
  conversationId,
  userId,
  content,
  type = "text",
  replyMessageId,
}: {
  conversationId: string;
  userId: string;
  content: string;
  type?: string;
  replyMessageId?: string | null;
}): Promise<Message | null> => {
  return messageService.createMessage({
    conversationId,
    userId,
    content,
    type,
    replyMessageId,
  });
};

export const fetchAllConversations = async () => {
  return await conversationRepository.getAll();
};

export const fetchConversationById = async (conversationId: string) => {
  return await conversationRepository.getById(conversationId);
};

export const deleteConversation = async (conversationId: string): Promise<Conversation | null> => {
  const normalizedConversationId = conversationId.trim();

  if (!normalizedConversationId) {
    return null;
  }

  try {
    return await db.transaction(async (tx) => {
      await tx.delete(participantsTable).where(eq(participantsTable.conversationId, normalizedConversationId));

      const [conversation] = await tx
        .delete(conversationsTable)
        .where(eq(conversationsTable.id, normalizedConversationId))
        .returning();

      return conversation ?? null;
    });
  } catch {
    return null;
  }
};
