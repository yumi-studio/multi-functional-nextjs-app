"use client";

import { Post, ReactionType } from "@/app/lib/fakebook/definitions";
import { useFakebookStore } from "@/app/stores/fakebook-store";
import { faComment, faThumbsDown, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type PostItemFooterProps = {
  post: Post;
  changeReaction: (id: string, reaction: ReactionType) => void;
}

export default function PostItemFooter({ post, changeReaction }: PostItemFooterProps) {
  const setCurrentPost = useFakebookStore((state) => state.setCurrentPost);

  const handleCommentClick = () => {
    setCurrentPost(post);
  }

  return (
    <div className="post-footer flex justify-between items-center -ml-3 -mr-3 -mb-3 pt-[1px]">
      <div className={`post-reactions rounded-bl-lg px-3 py-2 flex-1/4 shrink-0 text-center bg-white cursor-pointer border-t-[1px] border-t-gray-300 hover:bg-gray-300`}
        onClick={e => { changeReaction(post.id, 1); }}
      >
        <span><FontAwesomeIcon width={20} icon={faThumbsUp} color={post.reaction === 1 ? "blue" : ""}/>&nbsp;{post.statistic.reactions.upvote}</span>
      </div>
      <div className={`post-reactions px-3 py-2 flex-1/4 shrink-0 text-center bg-white cursor-pointer border-t-[1px] border-t-gray-300 hover:bg-gray-300`}
        onClick={e => { changeReaction(post.id, 2); }}
      >
        <span><FontAwesomeIcon width={20} icon={faThumbsDown} color={post.reaction === 2 ? "blue" : ""}/>&nbsp;{post.statistic.reactions.downvote}</span>
      </div>
      <div className={`post-comments px-3 py-2 flex-1/4 shrink-0 text-center bg-white cursor-pointer border-t-[1px] border-t-gray-300 hover:bg-gray-300`}
        onClick={handleCommentClick}
      >
        <span><FontAwesomeIcon width={20} icon={faComment} />&nbsp;{post.statistic.comment}</span>
      </div>
      <div className={`post-share rounded-br-lg px-3 py-2 flex-1/4 shrink-0 text-center bg-white cursor-pointer border-t-[1px] border-t-gray-300 hover:bg-gray-300`}>
        <span><FontAwesomeIcon width={20} icon={faShare} />&nbsp;{post.statistic.share}</span>
      </div>
    </div>
  )
}
