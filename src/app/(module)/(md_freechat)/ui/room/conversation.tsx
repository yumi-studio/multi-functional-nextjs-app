"use client"

import { TextareaAutosize } from "@mui/material";
import { EditorIconButton } from "../buttons";
import { cn } from "@/app/lib/utils";
import { faChevronRight, faFileAlt, faImage, faMicrophone, faSmile, faVideo } from "@fortawesome/free-solid-svg-icons";
import MessageList from "../message-list";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";
import Loading from "../../[locale]/freechat/loading";
import { getMessages, sendMessage } from "../../actions/conversations";
import { useConversationStore } from "../../stores/conversation-store";

const Conversation = ({ id }: { id: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [state, sendMessageAction, pending] = useActionState(sendMessage, undefined);
  const addMessages = useConversationStore(state => state.addMessages);
  const sendMessageFormRef = useRef<HTMLFormElement>(null);

  const init = debounce(async () => {
    setLoaded(true);
  }, 100);

  useEffect(() => {
    init();
  }, [])

  useEffect(() => {
    if (pending) return;
    if (state?.data) {
      addMessages([state.data], 'latest');
    }
  }, [state, pending])

  const handleTextareaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || ((event.shiftKey || event.ctrlKey || event.altKey) && event.key === 'Enter')) return;

    event.preventDefault();
    sendMessageFormRef.current?.requestSubmit();
  };

  return !loaded ? <Loading /> : (
    <div className="w-full h-full max-w-7xl mx-auto bg-inherit border-x-2 border-(--fc-border) relative flex flex-col">
      {/* Message stream */}
      <MessageList id={id} />

      {/* Message editor */}
      <div className="shrink-0 grow-0 relative z-10 w-full p-3 bg-(--fc-background)">
        {/* Presence wrapper */}
        {/* <div className="relative -z-10 w-full">
          <div className="absolute bottom-0 left-0 inline-block w-auto p-2 pb-4 -mb-2 bg-(--fc-surface-muted) rounded-md">
            <span className="text-(--fc-text-secondary) text-sm">Someone is typing...</span>
          </div>
        </div> */}
        <div className="w-full h-auto border-2 border-(--fc-border) p-3 rounded-md bg-inherit">
          {/* Wrapper for text and selected files */}
          <form action={sendMessageAction} id="form-send-message" ref={sendMessageFormRef}>
            <input type="hidden" name="conversationId" value={id} />
            {/* Text content */}
            <TextareaAutosize
              className={cn([
                "w-full h-10 focus:h-32 p-2 outline-0 rounded-md bg-(--fc-surface) text-(--fc-text-secondary)",
                "focus:text-(--fc-text-primary)"
              ])}
              placeholder="Type something..."
              name="content"
              onKeyDown={handleTextareaKeyDown}>
            </TextareaAutosize>

            {/* Selected files */}
            {/* <div className="h-0.5 bg-(--fc-border) my-1" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((item, index) => (
                  <div key={index} className="flex-1">
                    <Image src="/next.svg" alt="bruh" width={120} height={120} />
                  </div>
                ))}
              </div> */}
          </form>
          <div className="h-0.5 bg-(--fc-border) my-3" />
          <div className="w-full flex items-center gap-2 bg-inherit">
            <div className="inline-flex gap-2 bg-inherit">
              <EditorIconButton title="Upload Image" icon={faImage} />
              <EditorIconButton title="Upload Video" icon={faVideo} />
              <EditorIconButton title="Upload Record" icon={faMicrophone} />
              <EditorIconButton title="Upload Document" icon={faFileAlt} />
            </div>
            <div className="ml-auto inline-flex gap-2">
              <EditorIconButton title="Send Sticker" icon={faSmile} type="primary" />
              <EditorIconButton title="Send Message" icon={faChevronRight} type="primary" onClick={() => { sendMessageFormRef.current?.requestSubmit() }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Conversation;
