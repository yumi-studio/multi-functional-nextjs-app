"use client";

import { Post, ReactionType } from "@/app/lib/fakebook/definitions";
import { postService } from "@/app/services/fakebook/post.service";
import { useFakebookStore } from "@/app/stores/fakebook-store";
import { faComment, faThumbsDown, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export type PostItemFooterProps = {
  post: Post;
  reloadStatistic: (id: string) => void;
}

export default function PostItemFooter({ post, reloadStatistic }: PostItemFooterProps) {
  const [statistic, setStatistic] = useState(post.statistic);
  const [reaction, setReaction] = useState<ReactionType | null>(post.reaction);
  const setCurrentPost = useFakebookStore((state) => state.setCurrentPost);

  const onReactClick = async (e: React.MouseEvent, type: ReactionType) => {
    const { success } = await postService.reactPost({ postId: post.id, type: type });
    if (success) {
      setReaction(reaction === type ? null : type);
      reloadStatistic(post.id);
    }
  }

  const handleCommentClick = () => {
    setCurrentPost(post);
  }

  useEffect(() => {
    setStatistic(post.statistic);
  }, [post.statistic]);

  return (
    <div className="post-footer flex justify-between items-center -ml-3 -mr-3 -mb-3 pt-[1px]">
      <div className={`post-reactions rounded-bl-lg px-3 py-2 flex-1/4 shrink-0 text-center bg-white cursor-pointer border-t-[1px] border-t-gray-300 hover:bg-gray-300`}
        onClick={e => { onReactClick(e, 1); }}
      >
        <span><FontAwesomeIcon width={20} icon={faThumbsUp} color={reaction === 1 ? "blue" : ""}/>&nbsp;{statistic.reactions.upvote}</span>
      </div>
      <div className={`post-reactions px-3 py-2 flex-1/4 shrink-0 text-center bg-white cursor-pointer border-t-[1px] border-t-gray-300 hover:bg-gray-300`}
        onClick={e => { onReactClick(e, 2); }}
      >
        <span><FontAwesomeIcon width={20} icon={faThumbsDown} color={reaction === 2 ? "blue" : ""}/>&nbsp;{statistic.reactions.downvote}</span>
      </div>
      <div className={`post-comments px-3 py-2 flex-1/4 shrink-0 text-center bg-white cursor-pointer border-t-[1px] border-t-gray-300 hover:bg-gray-300`}
        onClick={handleCommentClick}
      >
        <span><FontAwesomeIcon width={20} icon={faComment} />&nbsp;{statistic.comment}</span>
      </div>
      <div className={`post-share rounded-br-lg px-3 py-2 flex-1/4 shrink-0 text-center bg-white cursor-pointer border-t-[1px] border-t-gray-300 hover:bg-gray-300`}>
        <span><FontAwesomeIcon width={20} icon={faShare} />&nbsp;{statistic.share}</span>
      </div>
    </div>
  )
}
