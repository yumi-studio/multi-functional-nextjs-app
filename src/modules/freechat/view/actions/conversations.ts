"use server";

import z from "zod";
import * as _ from "lodash"
import * as conversationService from "@/modules/freechat/services/conversation.service";
import * as userRepo from "@/modules/freechat/repositories/user.repository";
import * as conversationRepo from "@/modules/freechat/repositories/conversation.repository";
import * as participantRepo from "@/modules/freechat/repositories/participant.repository";
import { Conversation, Message, Participant, UserPresence, UserPresenceMap } from "@/modules/freechat/shared/types";
import { verifyAuthUser } from ".";
import { mapByAndOmit } from "@/app/lib/utils";
import { getByConversationIdWithAnchor } from "@/modules/freechat/repositories/message.repository";
import { cacheReadMultiple, cacheWrite } from "@/modules/core/services/redis.service";
import { cache } from "react";

export type ConversationFormState = {
  data?: Conversation;
  message?: string;
  errors?: {
    name?: string[]
  };
} | undefined;

const ConversationFormSchema = z.object({
  name: z.string()
});

export const createConversation = async (state: ConversationFormState, formData: FormData): Promise<ConversationFormState> => {
  const authUser = await verifyAuthUser();
  if (!authUser) {
    return { message: 'User is unauthenticated' }
  };
  const validated = ConversationFormSchema.safeParse({
    name: formData.get('name')
  });

  if (!validated.success) {
    return {
      message: 'Invalid data',
      errors: z.flattenError(validated.error).fieldErrors
    }
  }

  const conversation = await conversationService.createConversation({
    name: validated.data.name,
    participantUserIds: [authUser!.id]
  })

  if (!conversation) return { message: 'Conversation creation failed' };

  return { data: conversation.conversation, message: 'Conversation creation success' };
}

export const getJoinedConversations = async () => {
  const user = await verifyAuthUser();
  const userId = user?.id;
  if (!userId) {
    return [];
  }

  const list = await conversationRepo.getAllByUser(userId);
  return list;
}

export const getConversationMembers = async (conversationId: string): Promise<Participant[]> => {
  const user = await verifyAuthUser();
  const userId = user?.id;
  if (!userId) {
    return [];
  }

  const participants = await participantRepo.getByConversationId(conversationId);
  const userIds = participants.map(p => p.userId);
  const users = await userRepo.getManyById(userIds);
  const usersMap = mapByAndOmit(users, 'id', 'passwordHash');
  return participants.map(p => ({
    ...p,
    user: usersMap[p.userId] || null
  }));
}

export const getConversationPresences = async (conversationId: string): Promise<UserPresenceMap> => {
  const userIds = await participantRepo.getUserIdsByConversationId(conversationId);
  const presenceCacheKeys = userIds.map(id => `presence:{${id}}`);
  const presences = (await cacheReadMultiple(presenceCacheKeys)).map((data, index) => {
    const parsed: { status: boolean, lastSeen: number } | null = data ? JSON.parse(data) : null;
    if (parsed) {
      return {
        userId: userIds[index],
        isOnline: parsed.status,
        lastOnline: parsed.lastSeen ? new Date(parsed.lastSeen) : null,
      };
    }
    return null;
  });
  return _.zipObject(userIds, presences) as UserPresenceMap;
}

export type SendMessageFormState = {
  data?: Message;
  message?: string;
  errors?: {
    conversationId?: string[];
    content?: string[];
  };
} | undefined;

const SendMessageFormSchema = z.object({
  conversationId: z.string().nonempty().trim(),
  content: z.string().nonempty().trim(),
});

export const sendMessage = async (state: SendMessageFormState, formData: FormData): Promise<SendMessageFormState> => {
  const authUser = await verifyAuthUser();
  if (!authUser) {
    return { message: 'User is unauthenticated' }
  };

  const validated = SendMessageFormSchema.safeParse({
    conversationId: formData.get('conversationId'),
    content: formData.get('content'),
  });

  if (!validated.success) {
    return {
      message: 'Invalid message data',
      errors: z.flattenError(validated.error).fieldErrors
    }
  }

  const message = await conversationService.saveNewMessage({
    conversationId: validated.data.conversationId,
    userId: authUser.id,
    content: validated.data.content,
    type: 'text',
    replyMessageId: null, // Add later for reply message
  })

  if (!message) {
    return { message: 'Message creation failed' };
  }

  return {
    data: message,
    message: 'Message creation success',
  }
}

export const getMessages = async (conversationId: string, anchorMessageId?: string | null) => {
  const messages = await getByConversationIdWithAnchor({ conversationId, anchorMessageId, limit: 30 });
  return messages;
}
