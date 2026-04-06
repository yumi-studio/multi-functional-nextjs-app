import Image from "next/image";
import { faImage, faVideo, faMicrophone, faFileAlt, faSmile, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { TextareaAutosize } from "@mui/material";
import { cn, cnMedia, formatDateTime, randomInt } from "@/app/lib/utils";
import { EditorIconButton } from "../../ui/buttons";
import { Suspense } from "react";
import MessageList from "../../ui/message-list";

const Page = async ({ params, searchParams }: PageProps<'/[locale]/freechat'>) => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-1/2">Freechat Entrance</div>
  )
}

export default Page;
