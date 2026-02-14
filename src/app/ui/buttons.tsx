"use client";

import { Link } from "@/i18n/navigation";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonProps, IconButton, IconButtonProps } from "@mui/material";

type DefaultButtonProp = ButtonProps;
type LinkButtonProp = {
  url: string;
} & ButtonProps;

type CircleIconButtonProp = {
  icon: IconProp;
} & IconButtonProps;

export const NormalButton = ({ ...prop }: DefaultButtonProp) => {
  return (
    <Button {...prop}>{prop.children}</Button>
  )
}

export const LinkButton = ({ url, ...prop }: LinkButtonProp) => {
  return (
    <Link href={url}>
      <Button type="button" {...prop} />
    </Link>
  )
}

export const CircleIconButton = ({ icon, ...iconButtonProp }: CircleIconButtonProp) => {
  return (
    <IconButton {...iconButtonProp}>
      <FontAwesomeIcon icon={icon} />
    </IconButton>
  )
}
