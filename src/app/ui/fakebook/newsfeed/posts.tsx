"use client";

import PostItem from "./post-item";
// import { useTranslations } from "next-intl";
import { useFakebookStore } from "@/app/stores/fakebook-store";
import { postService } from "@/app/services/fakebook/post.service";
import { ReactionType } from "@/app/lib/fakebook/definitions";
import { useEffect } from "react";

export default function Posts() {
  // const t = useTranslations("fakebook.newsfeed");
  const posts = useFakebookStore((state) => state.posts);
  const setPosts = useFakebookStore((state) => state.setPosts);
  const activeProfile = useFakebookStore((state) => state.activeProfile);

  const changeReaction = async (id: string, reaction: ReactionType) => {
    const reactRes = await postService.reactPost({ postId: id, type: reaction });
    if (!reactRes.success) return;

    const statisticRes = await postService.getPostStatisitic({ postId: id });
    if (!statisticRes.success) return;

    setPosts(posts.map(post => {
      return post.id === id ? {
        ...post,
        statistic: statisticRes.data,
        reaction: (post.reaction === reaction ? null : reaction)
      } : post
    }));
  }

  useEffect(() => {
    let hasChange = false;
    const updatePosts = posts.map((post) => {
      if (post.creator.id === activeProfile?.id) {
        hasChange = true;
        return { ...post, creator: { ...post.creator, avatarUrl: activeProfile.avatarUrl } };
      }

      return post;
    });
    if (hasChange) {
      setPosts(updatePosts);
    }
  }, [activeProfile?.avatarUrl])

  return (
    <>
      {posts.map((post) => (
        <PostItem key={post.id} post={post} changeReaction={changeReaction} />
      ))}
    </>
  );
}
