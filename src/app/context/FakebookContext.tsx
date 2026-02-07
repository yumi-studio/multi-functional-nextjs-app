"use client";

import { createContext, useContext } from "react";
import { postService } from "@/app/services/fakebook/post.service";
import { useFakebookStore } from "@/app/stores/fakebook-store";

type FakebookContextType = {
  actionDeletePost: (id: string) => Promise<void>;
}

type FakebookProviderProps = {
  children: React.ReactNode;
}

const FakebookContext = createContext<FakebookContextType | null>(null);

export const FakebookProvider = ({ children }: FakebookProviderProps) => {
  const removePost = useFakebookStore(state => state.removePost);

  const ctx: FakebookContextType = {
    actionDeletePost: async (id: string) => {
      const { success } = await postService.deletePost({ postId: id });
      if (success) {
        removePost(id);
      }
    }
  };

  return (
    <FakebookContext.Provider value={ctx}>
      {children}
    </FakebookContext.Provider>
  )
}

export const useFakebookContext = () => {
  const context = useContext(FakebookContext);
  if (!context) throw new Error("useFakebookContext must be used within FakebookProvider");
  return context;
}
