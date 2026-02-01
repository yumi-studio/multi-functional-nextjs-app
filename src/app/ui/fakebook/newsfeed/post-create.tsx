"use client";

import { UploadMediaFile } from "@/app/lib/fakebook/definitions";
import { postService } from "@/app/services/fakebook/post.service";
import { FakebookState, useFakebookStore } from "@/app/stores/fakebook-store";
import { SimpleDialog } from "@/app/ui/dialogs";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { faClose, faTrash, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import SimpleGalleryViewer, { GalleryItem } from "@/app/ui/simple-gallery-viewer";
import { uploadService } from "@/app/services/fakebook/upload.servie";

export default function PostCreate() {
  const t = useTranslations("fakebook.newsfeed");
  const newPostModalOpen = useFakebookStore((state: FakebookState) => state.newPostModalOpen);
  const newPostMediaPreviewOpen = useFakebookStore((state: FakebookState) => state.newPostMediaPreviewOpen);
  const setNewPostModalOpen = useFakebookStore((state: FakebookState) => state.setNewPostModalOpen);
  const setNewPostMediaPreviewOpen = useFakebookStore((state: FakebookState) => state.setNewPostMediaPreviewOpen);
  const addPost = useFakebookStore((state) => state.addPost);
  const onClose = () => {
    setNewPostModalOpen(false);
  }

  const [content, setContent] = useState<string>("");
  const [mediaFiles, setMediaFiles] = useState<UploadMediaFile[]>([]);

  const addNewMediaFile = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*,video/*";
    fileInput.multiple = true;
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        const files = Array.from(target.files);
        const newMediaFiles: UploadMediaFile[] = files.map(file => ({
          file,
          preview_url: URL.createObjectURL(file),
          type: file.type.startsWith("video/") ? "video" : "image",
          status: "pending"
        }));
        setMediaFiles(prev => [...prev, ...newMediaFiles]);
        fileInput.remove();
      }
    };
    fileInput.click();
  };
  const removeMediaFile = (index: number) => {
    setMediaFiles(prev => {
      const target = prev[index];
      if (target) {
        URL.revokeObjectURL(target.preview_url); // Clean up the object URL
      }
      return prev.filter((_, i) => i !== index);
    });
  };
  const handlePostSubmit = async () => {
    // Handle post submission logic here
    const uploadMediaPromises = mediaFiles.map(file => uploadService.uploadMedia(file));
    const uploadMediaResponses = await Promise.all(uploadMediaPromises);
    const mediaItems = uploadMediaResponses.map(res => res.data);
    const createPostResponse = await postService.createPost({
      content: content,
      visibility: 1,
      mediaItems: mediaItems.map(mi => mi)
    });
    if (createPostResponse.success && createPostResponse.data?.id) {
      const newPostResult = await postService.getPost({ postId: createPostResponse.data.id });
      if (newPostResult.success && newPostResult.data) {
        addPost(newPostResult.data);
        setMediaFiles([]);
        setNewPostModalOpen(false);
        setContent("");
      }
    }
  };

  return (
    <SimpleDialog open={newPostModalOpen} onClose={onClose}>
      <div className="w-svw h-svh sm:w-[640px] sm:h-[80vh] flex flex-col p-3">
        <div className="font-semibold relative flex items-center justify-center">
          <span>{t("editor_newPostTitle")}</span>
          <FontAwesomeIcon icon={faClose}
            className="absolute right-0 cursor-pointer"
            onClick={() => { onClose() }}
          />
        </div>
        <div className="bg-gray-300 h-[1px] my-3"></div>
        <form
          className="flex-auto overflow-auto"
        >
          <div className="form-item mb-2">
            <textarea
              name="post[content]"
              className="w-full resize-y min-h-56 border border-blue-500 p-2 rounded-md outline-blue-500 block"
              placeholder={t("editor_newPostPlaceholder")} onChange={e => setContent(e.target.value)} value={content}></textarea>
          </div>
          <div className="flex gap-2 items-center">
            <button type="button" className="border border-blue-500 rounded-sm inline-flex items-center justify-center h-8 px-3"
              onClick={() => addNewMediaFile()}>
              <FontAwesomeIcon icon={faImage} className="text-blue-500 text-[1rem]" width="1rem" height="1rem" />
            </button>
            <button type="button" className="border border-green-500 rounded-sm inline-flex items-center justify-center h-8 px-3"
              onClick={() => addNewMediaFile()}>
              <FontAwesomeIcon icon={faVideo} className="text-green-500 text-[1rem]" width="1rem" height="1rem" />
            </button>
            <button type="button"
              onClick={() => handlePostSubmit()}
              className="rounded-sm bg-blue-400 text-white inline-flex items-center justify-center h-8 px-3 ml-auto">
              {t("editor_newPostSubmitBtn")}
            </button>
          </div>
          <div className="hidden">
            <input type="file" name="post[media][]" multiple className="hidden" />
          </div>
          <div className="media-list">
            {mediaFiles.map((item, index) => (
              <div className="media-item flex items-center gap-2 my-2 shadow-sm border border-gray-200 rounded-md overflow-hidden" key={index}>
                {item.type === "image" && (
                  <div className="w-9 h-9 shrink-0 basis-9 inline-flex items-center justify-center rounded-md overflow-hidden">
                    <Image src={item.preview_url} alt={item.file.name} width={36} height={36}
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
                {item.type === "video" && (
                  <div className="w-9 h-9 inline-flex items-center justify-center rounded-md overflow-hidden">
                    <FontAwesomeIcon icon={faVideo} width="36" height="36" />
                  </div>
                )}
                <div className="media-item-label flex-auto py-0.5 text-ellipsis overflow-hidden cursor-pointer whitespace-nowrap"
                  onClick={() => setNewPostMediaPreviewOpen(true)}>{item.file.name}</div>
                <button className="p-2 text-red-500"
                  type="button"
                  onClick={() => removeMediaFile(index)}
                ><FontAwesomeIcon icon={faTrash} width="1rem" height="1rem" /></button>
              </div>
            ))}
          </div>
          {newPostMediaPreviewOpen && (
            <SimpleGalleryViewer items={mediaFiles.map((mediaFile) => {
              return {
                name: mediaFile.file.name,
                src: mediaFile.preview_url,
                type: mediaFile.type
              } as GalleryItem;
            })} isOpen={newPostMediaPreviewOpen} setIsOpen={setNewPostMediaPreviewOpen} />
          )}
        </form>
      </div>
    </SimpleDialog>
  );
}
