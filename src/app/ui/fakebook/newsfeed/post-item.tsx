"use client";

import { Post, ReactionType } from "@/app/lib/fakebook/definitions";
import { useFakebookStore } from "@/app/stores/fakebook-store";
import { faTrashCan, faPenToSquare, faFlag } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useMemo, useState } from "react";
import PostItemFooter from "./post-item-footer";
import { useAppContext } from "@/app/context/AppContext";
import SimpleGalleryViewer, { GalleryItem } from "../../simple-gallery-viewer";
import PostMediaLayout from "./post-media-layout";

export type PostItemProp = {
  post: Post;
  changeReaction: (id: string, reaction: ReactionType) => void;
}

export default function PostItem({ post, changeReaction }: PostItemProp) {
  const [showOptions, setShowOptions] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const currentPost = useFakebookStore((state) => state.currentPost);
  const appContext = useAppContext();
  const footer = useMemo(() => {
    return <PostItemFooter post={post} changeReaction={changeReaction} />
  }, [post, changeReaction]);

  return (
    <div className={
      `post bg-white rounded-lg shadow-sm p-3 mb-3 relative last:mb-16`
      + (currentPost && currentPost.id === post.id ? ` outline-2 outline-blue-600` : "")
    }>
      <div className="post-head flex items-center gap-x-2">
        <div className="post-avatar">
          <div className="avatar-user size-10 rounded-full bg-gray-500 overflow-hidden border-blue-500 border-2">
            {/* <Image src={post.creator?.avatarUrl} alt="Avatar" width={240} height={240} /> */}
            <Image src={"/sample/avatar/1.png"} alt="Avatar" width={240} height={240} />
          </div>
        </div>
        <div className="post-title shrink-0 cursor-pointer">
          <div className="user-displayname inline-block">
            <span className="font-bold">{post.creator.name}</span>
            {/* {post.creator.is_verified && <FontAwesomeIcon icon={faCircleCheck} color="blue" className="ml-1" />} */}
          </div>
          <div className="flex">
            <span className="text-[0.825rem]">#{new Date(post.createdAt).toLocaleString()}</span>
          </div>
        </div>
        <div className="post-options relative ml-auto select-none self-start">
          <FontAwesomeIcon icon={!showOptions ? faBars : faXmark}
            onClick={() => { setShowOptions(!showOptions) }}
            className="cursor-pointer" />
          <div className={`options absolute ${showOptions ? 'block' : 'hidden'} right-0 top-full bg-white shadow-lg rounded-md pt-1 pb-1 pl-2 pr-2 border-[1px] border-gray-200`}>
            <ul className="w-[100px]">
              <li className="cursor-pointer whitespace-nowrap" onClick={() => appContext.alertInDevelop()}>
                <FontAwesomeIcon className="mr-1.5" icon={faPenToSquare} />
                <span>Edit</span>
              </li>
              <hr className="text-gray-200 py-0.5" />
              <li className="cursor-pointer whitespace-nowrap" onClick={() => appContext.alertInDevelop()}>
                <FontAwesomeIcon className="mr-1.5" icon={faTrashCan} />
                <span>Delete</span>
              </li>
              <hr className="text-gray-200 py-0.5" />
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
        <div className="mb-3 whitespace-pre-wrap">{post.content}</div>
        {/* Post media items */}
        <PostMediaLayout items={post.mediaItems ?? []} setShowGallery={setShowGallery} />
      </div>
      {footer}
      {showGallery && post.mediaItems && post.mediaItems.length > 0 && (
        <SimpleGalleryViewer items={post.mediaItems.map((item) => {
          return {
            name: item.name,
            src: item.source,
            type: item.type
          } as GalleryItem;
        })} isOpen={showGallery} setIsOpen={setShowGallery} />
      )}
    </div>
  )
}
