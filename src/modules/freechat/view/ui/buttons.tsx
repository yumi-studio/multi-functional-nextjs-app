"use client";

import { cn } from "@/app/lib/utils";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ButtonProps = {
} & React.ComponentProps<"button">

export const Button = ({ children, className, onClick }: ButtonProps) => {
  return (
    <button type="button" className={cn([
      "px-2 py-1 border border-(--fc-text-primary) text-(--fc-text-primary) rounded-full",
      className
    ])}
      onClick={onClick}
    >{children}</button>
  )
}

type EditorIconButtonProps = {
  title: string;
  icon: IconProp;
  type?: 'default' | 'primary'
} & Omit<React.ComponentProps<"button">, 'type'>
export const EditorIconButton = ({ title, icon, type = 'default', className, ...props }: EditorIconButtonProps) => {
  return (
    <button type="button" className={cn([
      "inline-flex items-center justify-center p-1 border rounded-full w-8 h-8",
      type === 'default' && "border-(--fc-text-primary) bg-(--fc-text-primary) text-(--fc-primary)",
      type === 'primary' && "border-(--fc-primary) bg-(--fc-primary) text-(--fc-text-primary)",
      className,
    ])} title={title} {...props}>
      <FontAwesomeIcon icon={icon} fontSize="1rem" />
    </button>
  )
}
