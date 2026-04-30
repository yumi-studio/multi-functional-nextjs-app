import 'server-only';
import * as messageRepository from "@/modules/freechat/repositories/message.repository";
import * as participantRepository from "@/modules/freechat/repositories/participant.repository";
import * as conversationRepository from "@/modules/freechat/repositories/conversation.repository";
import { SelectMessage } from "@/modules/freechat/db/schema";

export const createMessage = async ({
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
}): Promise<SelectMessage | null> => {
  const normalizedConversationId = conversationId.trim();
  const normalizedUserId = userId.trim();
  const normalizedContent = content.trim();
  const normalizedType = type.trim();
  const normalizedReplyMessageId = replyMessageId?.trim() || null;

  if (!normalizedConversationId || !normalizedUserId || !normalizedContent || !normalizedType) {
    return null;
  }

  const [conversation, participant, replyMessage] = await Promise.all([
    conversationRepository.getById(normalizedConversationId),
    participantRepository.getByConversationIdAndUserId(normalizedConversationId, normalizedUserId),
    normalizedReplyMessageId ? messageRepository.getById(normalizedReplyMessageId) : Promise.resolve(null),
  ]);

  if (!conversation || !participant) {
    return null;
  }

  if (replyMessage && replyMessage.conversationId !== normalizedConversationId) {
    return null;
  }

  const messageId = await messageRepository.createOne({
    conversationId: normalizedConversationId,
    userId: normalizedUserId,
    content: normalizedContent,
    type: normalizedType,
    replyMessageId: normalizedReplyMessageId,
  });

  if (!messageId) {
    return null;
  }

  return await messageRepository.getById(messageId);
};

export const editMessage = async ({
  messageId,
  content,
}: {
  messageId: string;
  content: string;
}): Promise<SelectMessage | null> => {
  const normalizedMessageId = messageId.trim();
  const normalizedContent = content.trim();

  if (!normalizedMessageId || !normalizedContent) {
    return null;
  }

  const existingMessage = await messageRepository.getById(normalizedMessageId);

  if (!existingMessage || existingMessage.deletedAt) {
    return null;
  }

  return await messageRepository.updateById(normalizedMessageId, {
    content: normalizedContent,
  });
};

export const deleteMessage = async ({
  messageId,
  softDelete = true,
}: {
  messageId: string;
  softDelete?: boolean;
}): Promise<SelectMessage | null> => {
  const normalizedMessageId = messageId.trim();

  if (!normalizedMessageId) {
    return null;
  }

  return softDelete
    ? await messageRepository.softDeleteById(normalizedMessageId)
    : await messageRepository.deleteById(normalizedMessageId);
};

export const fetchAllMessages = async () => {
  return await messageRepository.getAll();
};

export const fetchMessagesByConversationId = async ({
  conversationId,
  includeDeleted = false,
}: {
  conversationId: string;
  includeDeleted?: boolean;
}) => {
  return includeDeleted
    ? await messageRepository.getByConversationId(conversationId)
    : await messageRepository.getActiveByConversationId(conversationId);
};
