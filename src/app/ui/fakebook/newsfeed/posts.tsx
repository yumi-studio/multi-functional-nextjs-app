"use client";

import PostItem from "./post-item";
import { useTranslations } from "next-intl";
import { useFakebookStore } from "@/app/stores/fakebook-store";
import { postService } from "@/app/services/fakebook/post.service";
import { Post } from "@/app/lib/fakebook/definitions";

export default function Posts() {
  const t = useTranslations("fakebook.newsfeed");
  const posts = useFakebookStore((state) => state.posts);
  const setPosts = useFakebookStore((state) => state.setPosts);

  const reloadStatistic = async (id: string) => {
    const { success, data } = await postService.getPostStatisitic({ postId: id });
    if (success && data) {
      const _tmpPosts: Post[] = posts.map(post => {
        return post.id === id ? { ...post, statistic: data } : post
      })
      setPosts(_tmpPosts);
    }
  }

  return (
    <>
      {posts.map((post) => (
        <PostItem key={post.id} post={post} reloadStatistic={reloadStatistic} />
      ))}
    </>
  );
}
