"use server";

import z from "zod";
import * as conversationService from "@/modules/freechat/services/conversation.service";
import { Conversation } from "../lib/types";
import { verifyAuthUser } from ".";

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
  console.log(state, [...formData.entries()])
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
