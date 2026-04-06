import { cn } from "@/app/lib/utils";
import { faImage, faVideo, faMicrophone, faFileAlt, faSmile, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { TextareaAutosize } from "@mui/material";
import { EditorIconButton } from "../../../ui/buttons";
import MessageList from "../../../ui/message-list";

const RoomPage = async ({ }: PageProps<'/[locale]/freechat/room'>) => {
  return (
    <div className="w-full h-full max-w-7xl mx-auto bg-inherit border-x-2 border-(--fc-border) relative flex flex-col">
      {/* Message stream */}
      <MessageList />

      {/* Message editor */}
      <div className="shrink-0 grow-0 relative z-10 w-full p-3 bg-inherit">
        {/* Presence wrapper */}
        <div className="relative -z-10 w-full">
          <div className="absolute bottom-0 left-0 inline-block w-auto p-2 pb-4 -mb-2 bg-(--fc-surface-muted) rounded-md">
            <span className="text-(--fc-text-secondary) text-sm">Someone is typing...</span>
          </div>
        </div>
        <div className="w-full h-auto border-2 border-(--fc-border) p-3 rounded-md bg-inherit">
          {/* Wrapper for text and selected files */}
          <div className="">
            {/* Text content */}
            <TextareaAutosize
              className={cn([
                "w-full max-h-32 p-2 resize-none outline-0 rounded-md bg-(--fc-surface) text-(--fc-text-secondary)",
                "focus:text-(--fc-text-primary)"
              ])}
              placeholder="Type something...">
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
          </div>
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
              <EditorIconButton title="Send Message" icon={faChevronRight} type="primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomPage;
