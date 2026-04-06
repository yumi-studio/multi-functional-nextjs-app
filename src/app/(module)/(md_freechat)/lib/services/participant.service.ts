"use server";

import { and, eq } from "drizzle-orm";

import { db } from "../db";
import { participantsTable } from "../db/schema";
import type { Participant } from "../types";
import * as participantRepository from "../repositories/participant.repository";

export const changeParticipantNickname = async ({
  participantId,
  nickname,
}: {
  participantId: string;
  nickname: string | null;
}): Promise<Participant | null> => {
  const normalizedParticipantId = participantId.trim();

  if (!normalizedParticipantId) {
    return null;
  }

  return await participantRepository.updateById(normalizedParticipantId, {
    nickname: nickname?.trim() || null,
  });
};

export const changeParticipantNicknameByConversation = async ({
  conversationId,
  userId,
  nickname,
}: {
  conversationId: string;
  userId: string;
  nickname: string | null;
}): Promise<Participant | null> => {
  const participant = await participantRepository.getByConversationIdAndUserId(
    conversationId.trim(),
    userId.trim()
  );

  if (!participant) {
    return null;
  }

  return await participantRepository.updateById(participant.id, {
    nickname: nickname?.trim() || null,
  });
};

export const leaveConversation = async ({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}): Promise<Participant | null> => {
  const normalizedConversationId = conversationId.trim();
  const normalizedUserId = userId.trim();

  if (!normalizedConversationId || !normalizedUserId) {
    return null;
  }

  try {
    const [participant] = await db
      .delete(participantsTable)
      .where(
        and(
          eq(participantsTable.conversationId, normalizedConversationId),
          eq(participantsTable.userId, normalizedUserId)
        )
      )
      .returning();

    return participant ?? null;
  } catch {
    return null;
  }
};

export const fetchParticipantsByConversationId = async (conversationId: string) => {
  return await participantRepository.getByConversationId(conversationId);
};

export const fetchParticipantsByUserId = async (userId: string) => {
  return await participantRepository.getByUserId(userId);
};
