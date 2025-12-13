"use client";

import { Post } from "@/app/lib/fakebook/definitions";
import { useFakebookStore } from "@/app/stores/fakebook-store";
import { faTrashCan, faPenToSquare, faFlag } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";
import PostItemFooter from "./post-item-footer";
import { useAppContext } from "@/app/context/AppContext";

export type PostItemProp = {
  post: Post;
  reloadStatistic: (id: string) => void;
}

export default function PostItem({ post, reloadStatistic }: PostItemProp) {
  const [showOptions, setShowOptions] = useState(false);
  const currentPost = useFakebookStore((state) => state.currentPost);
  const appContext = useAppContext();

  return (
    <div className={
      `post bg-white rounded-lg shadow-sm p-3 mb-3 relative last:mb-16`
      + (currentPost && currentPost.id === post.id ? ` outline-2 outline-blue-600` : "")
    }>
      <div className="post-head flex items-center gap-x-2">
        <div className="post-avatar">
          <div className="avatar-user size-10 rounded-full bg-gray-500 overflow-hidden border-blue-500 border-2">
            <Image src={post.creator?.avatarUrl} alt="Avatar" width={240} height={240} />
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
      <div className="post-body py-3">
        <div className="post-content mb-3">{post.content}</div>
        {post.mediaItems && post.mediaItems.length > 0 && (
          <div className="post-media flex gap-2 items-stretch justify-center flex-wrap">
            {post.mediaItems.map((media) => (
              <div key={media.id} className={`media-item ${media.type} relative`}>
                {media.type === 'image' && (
                  <Image src={media.source} alt={media.name} height={320} width={240}
                    className="rounded-md" />
                )}
                {/* {media.type === 'video' && (
                  <Image src={media.thumbnailUrl} alt={media.thumbnailUrl} width={500} height={300}
                    className="rounded-md" />
                  // <div className="video-wrapper overflow-hidden w-[500px] h-[300px]">
                  //   <video controls className="rounded-md" width={500} height={300}>
                  //     <source src={media.url} type="video/mp4" />
                  //     Your browser does not support the video tag.
                  //   </video>
                  // </div>
                )} */}
              </div>
            ))}
          </div>
        )}
      </div>
      <PostItemFooter post={post} reloadStatistic={reloadStatistic} />
    </div>
  )
}
