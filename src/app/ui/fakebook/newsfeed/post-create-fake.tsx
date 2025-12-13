"use client";

import { FakebookState, useFakebookStore } from "@/app/stores/fakebook-store";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { faAdd, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";

export default function PostCreateFake() {
  const t = useTranslations("fakebook.newsfeed");
  const setNewPostModalOpen = useFakebookStore((state: FakebookState) => state.setNewPostModalOpen);

  return (
    <div className="mb-3 w-full p-3 rounded-lg bg-white shadow-sm">
      <div className="text-gray-500 mb-2 border rounded-lg border-gray-200 p-2">{t("editor_placeholder")}</div>
      <div className="flex gap-2 items-center">
        <button className="border border-blue-300 rounded-sm inline-flex items-center justify-center h-6 px-1">
          <FontAwesomeIcon icon={faImage} className="text-blue-500 text-[1rem]" width="1rem" height="1rem" />
        </button>
        <button className="border border-green-300 rounded-sm inline-flex items-center justify-center h-6 px-1">
          <FontAwesomeIcon icon={faVideo} className="text-green-500 text-[1rem]" width="1rem" height="1rem" />
        </button>
        <button
          className="border border-gray-300 rounded-sm inline-flex items-center justify-center h-6 px-1 ml-auto"
          title={t("editor_new_btn")}
          onClick={() => setNewPostModalOpen(true)}>
          <FontAwesomeIcon icon={faAdd} className="text-gray-500 text-[1rem]" width="1rem" height="1rem" />
        </button>
      </div>
    </div>
  )
}
