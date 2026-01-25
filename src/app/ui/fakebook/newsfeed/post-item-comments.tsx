"use client";

import { Comment, ReactionType } from "@/app/lib/fakebook/definitions";
import { commentService } from "@/app/services/fakebook/comment.service";
import { postService } from "@/app/services/fakebook/post.service";
import { useFakebookStore } from "@/app/stores/fakebook-store";
import { SimpleDialog } from "@/app/ui/dialogs";
import { faClose, faEllipsisVertical, faPenToSquare, faThumbsDown, faThumbsUp, faTrash, faUser, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Skeleton } from "@mui/material";
import Image from "next/image";
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import PostCommentEditor from "./post-comment-editor";

type PostCommentOptionsProp = {
  handleEdit: () => void;
  handleReport: () => void;
  handleDelete: () => void;
}

type PostCommentProp = {
  comment: Comment;
  isReply: boolean;
  changeReaction: (id: string, reaction: ReactionType) => Promise<void>;
}

function CommentSkeleton() {
  return (
    <div className="comment flex items-start gap-2 mb-3 text-[0.875rem]">
      {/* Avatar */}
      <div className="comment-avatar size-10 rounded-full overflow-hidden border-blue-500 border-2">
        <Skeleton className="h-full w-full rounded-full" />
      </div>

      {/* Detail */}
      <div className="comment-detail flex-auto">
        {/* Display name + options */}
        <div className="comment-displayname font-semibold flex w-full pb-1 justify-between items-center">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-5" />
        </div>

        {/* Content bubble */}
        <div className="flex w-full gap-1 mb-1">
          <div className="comment-content flex-auto bg-gray-200 rounded-2xl rounded-tl-none px-2 py-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mt-1" />
          </div>
        </div>

        {/* Bottom bar: reactions */}
        <div className="comment-bottom flex gap-2 mt-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function PostComment({ comment, isReply = false, changeReaction }: PostCommentProp) {
  const handleEdit = () => {
  };
  const handleDelete = async () => {
  };
  const handleReport = () => {
  }

  return (
    <div className="comment flex items-start gap-2 mb-3 text-[0.875rem]">
      <div className="comment-avatar size-10 rounded-full overflow-hidden border-blue-500 border-2">
        {comment.creator.avatarUrl && (
          <Image src={comment.creator.avatarUrl} alt={comment.creator.avatarUrl} width={120} height={120}></Image>
        )}
        {!comment.creator.avatarUrl && (
          <FontAwesomeIcon icon={faUser} widthAuto fontSize={'40px'} color="gray" />
        )}
      </div>
      <div className="comment-detail flex-auto">
        <div className="comment-displayname font-semibold flex w-full pb-1">
          <span>{comment.creator.name}</span>
          <PostCommentOptions
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleReport={handleReport} />
        </div>
        <div className="flex w-full gap-1 mb-1">
          <div className="comment-content flex-auto"
          ><div className="bg-gray-200 rounded-2xl rounded-tl-none px-2 py-1 whitespace-pre-wrap">{comment.content}</div></div>
        </div>
        <div className="comment-bottom flex gap-1">
          <span
            className="react-up-count inline-block rounded-full bg-gray-200 px-2 text-[0.875rem] cursor-pointer"
            onClick={e => changeReaction(comment.id, 1)}
          >
            <FontAwesomeIcon className="" icon={faThumbsUp} color={comment.reaction === 1 ? "blue" : ""} />&nbsp;{comment.statistic.reactions.upvote}
          </span>
          <span
            className="react-down-count inline-block rounded-full bg-gray-200 px-2 text-[0.875rem] cursor-pointer"
            onClick={e => changeReaction(comment.id, 2)}
          >
            <FontAwesomeIcon className="" icon={faThumbsDown} color={comment.reaction === 2 ? "blue" : ""} />&nbsp;{comment.statistic.reactions.downvote}
          </span>
          {/* {!isReply && (
            <span
              className="reply-count inline-block rounded-full bg-gray-200 px-2 text-[0.875rem] cursor-pointer"
              onClick={() => { setLoadReplies(true) }}
            >
              <FontAwesomeIcon className="" icon={faReply} />&nbsp;{statistic.replies}
            </span>
          )} */}
        </div>
        {/* {loadReplies && <PostCommentReplies comment={comment} />} */}
      </div>
    </div>
  )
}

const PostCommentOptions = memo(
  function PostCommentOptions(props: PostCommentOptionsProp) {
    const { handleEdit, handleDelete, handleReport } = props;
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [open]);

    return (
      <div className="comment-options relative shrink-0 inline-block ml-auto">
        <div className={open ? "pointer-events-none" : ""}>
          <FontAwesomeIcon className="cursor-pointer" icon={faEllipsisVertical} onClick={(e) => { setOpen(o => !o) }} />
        </div>
        <div className={
          `absolute top-1 right-full bg-white px-2 py-1.5 z-10 rounded-[0.5rem] w-30 whitespace-nowrap flex flex-col gap-1 outline-1 outline-gray-400 `
          + (open ? "" : "hidden")
        } ref={menuRef}>
          <div onClick={handleEdit}><FontAwesomeIcon className="" icon={faPenToSquare} />&nbsp;Edit</div>
          <hr className="text-gray-400" />
          <div onClick={handleDelete}><FontAwesomeIcon className="" icon={faTrash} />&nbsp;Delete</div>
          <hr className="text-gray-400" />
          <div onClick={handleReport}><FontAwesomeIcon className="" icon={faWarning} />&nbsp;Report</div>
        </div>
      </div>
    )
  }
);

// function PostCommentReplies({ comment }: { comment: Comment }) {
//   return (
//     <div className="comment-replies mt-3">
//       {comment.replies?.map(reply => (
//         <PostComment key={reply.id} comment={reply} isReply={true} />
//       ))}
//     </div>
//   )
// }

export default function PostItemComments() {
  const [loadMore, setLoadMore] = useState(true);
  const [pager, setPager] = useState<{ before: Date | null; hasMore: boolean }>({
    before: null,
    hasMore: true
  });
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const currentPost = useFakebookStore((state) => state.currentPost);
  const setCurrentPost = useFakebookStore((state) => state.setCurrentPost);
  const commentsRef = useRef<HTMLDivElement>(null);
  const onClose = () => {
    setCurrentPost(null);
  }

  const scrollToTop = useCallback(() => {
    if (commentsRef.current) {
      commentsRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [commentsRef]);

  const scrollToBottom = useCallback(() => {
    if (commentsRef.current) {
      commentsRef.current.scrollTo({ top: commentsRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [commentsRef]);

  const saveComment = useCallback(async (content: string) => {
    if (!currentPost?.id) return;
    const createRes = await postService.createComment({ content: content, postId: currentPost.id });
    if (!createRes.success || !createRes.data?.id) return;
    const detailRes = await commentService.getComment({ id: createRes.data.id });
    if (!detailRes.success || !detailRes.data) return;
    setComments(prev => {
      const data = detailRes.data;
      return [data, ...prev];
    });
    scrollToTop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPost]);

  const changeReaction = async (id: string, reaction: ReactionType) => {
    const reactRes = await commentService.reactComment({ id, type: reaction });
    if (!reactRes.success) return;
    const statisticRes = await commentService.getStatistic({ id });
    if (!reactRes.success) return;

    setComments(prev => prev.map(comment => {
      return comment.id === id ? {
        ...comment,
        statistic: statisticRes.data,
        reaction: comment.reaction === reaction ? 0 : reaction
      } : comment
    }));
  }

  const commentEditor = useMemo(() => {
    return <PostCommentEditor saveComment={saveComment} />
  }, [saveComment]);

  useEffect(() => {
    if (!currentPost) {
      // Reset if currentPost is null
      setLoadMore(true);
      setPager({ before: null, hasMore: true });
      setComments([]);
    }
  }, [currentPost]);

  useEffect(() => {
    if (!loadMore) return;
    if (!currentPost) return;
    if (!pager.hasMore) return;
    setLoading(true);
    (async () => {
      const { success, data } = await postService.getCommentsByPage({
        postId: currentPost.id,
        before: pager.before ?? new Date(),
        limit: 3
      });
      if (success && data) {
        setPager(prev => { return { ...prev, before: data.next, hasMore: !!data.next } });
        setComments(prev => { return [...prev, ...data.items] });
        setLoading(false);
        setLoadMore(false);
        scrollToBottom();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPost, loadMore]);

  if (!currentPost || !currentPost?.id) return;

  return (
    <SimpleDialog open={!!currentPost} onClose={onClose}>
      <div className="w-svw h-svh sm:w-[640px] sm:h-[80vh] flex flex-col p-3">
        <div className="font-semibold relative flex items-center justify-center">
          <span>Comments</span>
          <FontAwesomeIcon icon={faClose}
            className="absolute right-0 cursor-pointer"
            onClick={() => { onClose() }}
          />
        </div>
        <div className="bg-gray-300 h-[1px] my-3"></div>
        <div className="comments flex-auto overflow-auto" ref={commentsRef}>
          {comments && comments.map(comment => (
            <PostComment key={comment.id} comment={comment} isReply={false} changeReaction={changeReaction} />
          ))}
          {loading && (
            <>
              <CommentSkeleton /><CommentSkeleton /><CommentSkeleton />
            </>
          )}
          {pager.hasMore && (
            <div className="text-center">
              <Button type="button" variant="text" onClick={() => setLoadMore(true)}>Load more...</Button>
            </div>
          )}
        </div>
        {commentEditor}
      </div>
    </SimpleDialog>
  )
}
