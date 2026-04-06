"use client";

import { } from "@/app/lib/url_paths";
import { useTranslations } from "next-intl";
import { useFakebookStore } from "../../stores/fakebook-store";

export default function PostCreateFake() {
  const t = useTranslations("fakebook.newsfeed");
  const setNewPostModalOpen = useFakebookStore((state) => state.setNewPostModalOpen);

  return (
    <div className="mb-3 w-full p-3 rounded-lg bg-white shadow-sm">
      <div className="flex gap-2 items-center">
        <button
          className="border border-gray-300 rounded-sm inline-flex items-center justify-center h-6 px-2"
          title={t("editor_new_btn")}
          onClick={() => setNewPostModalOpen(true)}>
          <span>Post</span>
        </button>
      </div>
    </div>
  )
}
