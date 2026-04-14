"use server";

import z from "zod";
import * as _ from "lodash"
import * as conversationService from "@/modules/freechat/services/conversation.service";
import * as userRepo from "@/modules/freechat/repositories/user.repository";
import * as conversationRepo from "@/modules/freechat/repositories/conversation.repository";
import * as participantRepo from "@/modules/freechat/repositories/participant.repository";
import { Conversation, Message, Participant } from "../lib/types";
import { verifyAuthUser } from ".";
import { participantsTable, SelectUser, usersTable } from "@/modules/freechat/db/schema";
import { mapByAndOmit } from "@/app/lib/utils";
import { getByConversationIdWithAnchor } from "@/modules/freechat/repositories/message.repository";

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

export const getConversationMember = async (conversationId: string) => {
  const user = await verifyAuthUser();
  const userId = user?.id;
  if (!userId) {
    return [];
  }

  const participants = await participantRepo.getByConversationId(userId);
  const usersRaw = await userRepo.getManyById(_.map(participants, (p) => p.userId));
  const users = mapByAndOmit(usersRaw, "id", "passwordHash")
  const result = _.map(participants, (p) => {
    return { ...p, user: users[p.userId] } as Participant
  })

  return result;
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
