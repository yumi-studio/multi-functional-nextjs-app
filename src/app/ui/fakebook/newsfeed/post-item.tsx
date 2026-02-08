"use client";

import { Post, ReactionType } from "@/app/lib/fakebook/definitions";
import { useFakebookStore } from "@/app/stores/fakebook-store";
import { faTrashCan, faPenToSquare, faFlag, faUser, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useLayoutEffect, useMemo, useState } from "react";
import PostItemFooter from "./post-item-footer";
import { useAppContext } from "@/app/context/AppContext";
import SimpleGalleryViewer, { GalleryItem } from "../../simple-gallery-viewer";
import PostMediaLayout from "./post-media-layout";
import { formatDateTime } from "@/app/lib/utils";
import { useFakebookContext } from "@/app/context/FakebookContext";

export type PostItemProp = {
  post: Post;
  changeReaction: (id: string, reaction: ReactionType) => void;
}

export default function PostItem({ post, changeReaction }: PostItemProp) {
  const postContentLine = post.content?.split('\n') ?? [];
  const [showOptions, setShowOptions] = useState(false);
  const [showMore, setShowMore] = useState(postContentLine.length > 5 ? false : true);
  const [gallery, setGallery] = useState({
    isOpen: false,
    initialIndex: 0,
  });
  const currentPost = useFakebookStore((state) => state.currentPost);
  const appContext = useAppContext();
  const { actionDeletePost } = useFakebookContext();
  const activeProfile = useFakebookStore((state) => state.activeProfile);

  const footer = useMemo(() => {
    return <PostItemFooter post={post} changeReaction={changeReaction} />
  }, [post, changeReaction]);

  useLayoutEffect(() => {
  }, []);

  return (
    <div className={
      `post bg-white rounded-lg shadow-sm p-3 mb-3 relative last:mb-16`
      + (currentPost && currentPost.id === post.id ? ` outline-2 outline-blue-600` : "")
    }>
      <div className="post-head flex items-center gap-x-2">
        <div className="post-avatar">
          <div className="avatar-user size-10 rounded-full overflow-hidden border-blue-500 border-2">
            {post.creator.avatarUrl && (
              <Image src={post.creator.avatarUrl} alt={post.creator.avatarUrl} width={120} height={120} />
            )}
            {!post.creator.avatarUrl && (
              <FontAwesomeIcon icon={faUser} widthAuto fontSize={'40px'} color="gray" />
            )}
          </div>
        </div>
        <div className="post-title shrink-0 cursor-pointer">
          <div className="user-displayname inline-block">
            <span className="font-bold">{post.creator.name}</span>
            {/* {post.creator.is_verified && <FontAwesomeIcon icon={faCircleCheck} color="blue" className="ml-1" />} */}
          </div>
          <div className="flex">
            <span className="text-[0.825rem]">{formatDateTime(new Date(post.createdAt))}</span>
          </div>
        </div>
        <div className="post-options relative ml-auto select-none self-start z-10" onMouseLeave={() => setShowOptions(false)}>
          <FontAwesomeIcon icon={faBars}
            onClick={() => { setShowOptions(!showOptions) }}
            className="cursor-pointer" />
          <div className={`absolute ${showOptions ? 'block' : 'hidden'} right-0 top-0 bg-white shadow-lg rounded-md pt-1 pb-1 pl-2 pr-2 border-[1px] border-gray-200 bg-white`}>
            <ul className="w-[100px]">
              {activeProfile && post.creator.id === activeProfile.id && (
                <>
                  <li className="cursor-pointer whitespace-nowrap" onClick={() => appContext.alertInDevelop()}>
                    <FontAwesomeIcon className="mr-1.5" icon={faPenToSquare} />
                    <span>Edit</span>
                  </li>
                  <hr className="text-gray-200 py-0.5" />
                  <li className="cursor-pointer whitespace-nowrap" onClick={() => { actionDeletePost(post.id) }}>
                    <FontAwesomeIcon className="mr-1.5" icon={faTrashCan} />
                    <span>Delete</span>
                  </li>
                  <hr className="text-gray-200 py-0.5" />
                </>
              )}
              <li className="cursor-pointer whitespace-nowrap" onClick={() => appContext.alertInDevelop()}>
                <FontAwesomeIcon className="mr-1.5" icon={faFlag} />
                <span>Report</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Post body */}
      <div className="py-3">
        {/* Post content */}
        <div className="mb-3 bg-gray-100 rounded-md" onClick={() => { if (postContentLine.length > 5) setShowMore(!showMore) }}>
          <div className="whitespace-pre-wrap p-2">
            {showMore && post.content}
            {!showMore && postContentLine.length > 5 && (
              <>
                {postContentLine.slice(0, 5).join('\n')}
                <br /><span>...</span>
              </>
            )}
          </div>
          {postContentLine.length > 5 && (
            <div className="p-2 border-t border-gray-300 text-center text-xs">
              {!showMore && <b><FontAwesomeIcon icon={faChevronDown} /><span>Show more</span></b>}
              {showMore && <b><FontAwesomeIcon icon={faChevronUp} />Show less</b>}
            </div>
          )}
        </div>
        {/* Post media items */}
        <PostMediaLayout items={post.mediaItems ?? []} setGallery={setGallery} />
      </div>
      {footer}
      {gallery.isOpen && post.mediaItems && post.mediaItems.length > 0 && (
        <SimpleGalleryViewer items={post.mediaItems.map((item) => {
          return {
            name: item.name,
            src: item.source,
            type: item.type
          } as GalleryItem;
        })} isOpen={gallery.isOpen} setIsOpen={(isOpen) => { setGallery(prev => ({ ...prev, isOpen: isOpen })) }} initialIndex={gallery.initialIndex} />
      )}
    </div>
  )
}
