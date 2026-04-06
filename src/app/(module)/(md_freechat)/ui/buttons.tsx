"use client";

import { cn } from "@/app/lib/utils";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PropsWithChildren, ReactNode } from "react";

type ButtonProps = {
} & React.ComponentProps<"button">

export const Button = ({ children, className }: ButtonProps) => {
  return (
    <button type="button" className={cn([
      "px-2 py-1 border border-(--fc-text-primary) text-(--fc-text-primary) rounded-full",
      className
    ])}>{children}</button>
  )
}

type EditorIconButtonProps = {
  title: string;
  icon: IconProp;
  type?: 'default' | 'primary'
}
export const EditorIconButton = ({ title, icon, type = 'default' }: EditorIconButtonProps) => {
  return (
    <button type="button" className={cn([
      "inline-flex items-center justify-center p-1 border rounded-full w-8 h-8",
      type === 'default' && "border-(--fc-text-primary) bg-(--fc-text-primary) text-(--fc-primary)",
      type === 'primary' && "border-(--fc-primary) bg-(--fc-primary) text-(--fc-text-primary)"
    ])} title={title}>
      <FontAwesomeIcon icon={icon} fontSize="1rem" />
    </button>
  )
}
