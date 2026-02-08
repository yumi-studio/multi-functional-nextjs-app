"use client";

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, IconButtonProps } from "@mui/material";

type CircleIconButtonProp = {
  icon: IconProp;
} & IconButtonProps;
export const CircleIconButton = ({ icon, ...iconButtonProp }: CircleIconButtonProp) => {
  return (
    <>
      <IconButton {...iconButtonProp}>
        <FontAwesomeIcon icon={icon} />
      </IconButton>
    </>
  )
}
