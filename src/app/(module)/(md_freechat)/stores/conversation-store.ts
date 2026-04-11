'use client';

import { create } from "zustand";
import { Conversation } from "../lib/types";

type ConversationState = {
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  conversations: [],
  setConversations: (conversations) => set({ conversations: conversations }),
}))
