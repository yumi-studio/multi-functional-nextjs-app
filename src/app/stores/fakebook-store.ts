"use client";

import { create } from 'zustand';
import { Post, Profile } from '@/app/lib/fakebook/definitions';

export type FakebookState = {
  activeProfile: Profile | null,
  currentPost: Post | null;
  posts: Post[];
  newPostModalOpen: boolean;
  newPostMediaPreviewOpen: boolean;
  newPostButtonVisible: boolean;
  setActiveProfile: (profile: Profile | null) => void;
  setCurrentPost: (post: Post | null) => void;
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  removePost: (id: string) => void;
  setNewPostModalOpen: (open: boolean) => void;
  setNewPostMediaPreviewOpen: (open: boolean) => void;
  setNewPostButtonVisible: (visible: boolean) => void;
};

export const useFakebookStore = create<FakebookState>((set) => ({
  activeProfile: null,
  currentPost: null,
  posts: [],
  newPostModalOpen: false,
  newPostMediaPreviewOpen: false,
  newPostButtonVisible: true,
  setActiveProfile: (profile) => set({ activeProfile: profile }),
  setCurrentPost: (post) => set({ currentPost: post }),
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  removePost: (id: string) => set((state) => ({ posts: state.posts.filter(post => post.id !== id) })),
  setNewPostModalOpen: (open) => set({ newPostModalOpen: open }),
  setNewPostMediaPreviewOpen: (open) => set({ newPostMediaPreviewOpen: open }),
  setNewPostButtonVisible: (visible) => set({ newPostButtonVisible: visible })
}));
