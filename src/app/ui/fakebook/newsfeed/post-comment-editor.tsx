"use client";

import { Button, TextareaAutosize } from "@mui/material";
import { useEffect, useState } from "react";

export type EditorProps = {
  saveComment: (content: string) => Promise<void>
}

export default function PostCommentEditor({ saveComment }: EditorProps) {
  const [formData, setFormData] = useState({
    content: ""
  });

  const onCommentBtnClick = () => {
    saveComment(formData.content);
    setFormData({ content: "" });
  }

  return (
    <div className="-mx-3 -mb-3 w-auto p-3">
      <div className="bg-white flex items-start gap-2">
        <TextareaAutosize
          className="w-full min-h-14 resize-none outline-0 border-2 border-gray-500 rounded-md p-2"
          value={formData.content}
          placeholder="Enter comment"
          onChange={e => setFormData(prev => { return { ...prev, content: e.target.value } })} />
        <div className="inline-flex flex-col gap-2">
          <Button type="button" variant="outlined" size="small" onClick={onCommentBtnClick}>Comment</Button>
          <Button type="button" variant="outlined" size="small" color="secondary">Sticker</Button>
        </div>
      </div>
    </div>
  );
}
