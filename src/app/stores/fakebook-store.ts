"use client";

import { create } from 'zustand';
import { Post, Profile } from '@/app/lib/fakebook/definitions';

export type FakebookState = {
  activeProfile: Profile | null,
  currentPost: Post | null;
  posts: Post[];
  newPostModalOpen: boolean;
  newPostMediaPreviewOpen: boolean;
  setActiveProfile: (profile: Profile | null) => void;
  setCurrentPost: (post: Post | null) => void;
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  setNewPostModalOpen: (open: boolean) => void;
  setNewPostMediaPreviewOpen: (open: boolean) => void;
};

export const useFakebookStore = create<FakebookState>((set) => ({
  activeProfile: null,
  currentPost: null,
  posts: [],
  newPostModalOpen: false,
  newPostMediaPreviewOpen: false,
  setActiveProfile: (profile) => set({ activeProfile: profile }),
  setCurrentPost: (post) => set({ currentPost: post }),
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  setNewPostModalOpen: (open) => set({ newPostModalOpen: open }),
  setNewPostMediaPreviewOpen: (open) => set({ newPostMediaPreviewOpen: open }),
}));
