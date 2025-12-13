import { useMediaQuery, useTheme } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import React from 'react';

export interface SimpleDialogProps {
  children?: React.ReactNode;
  open: boolean;
  onClose: () => void;
}

export function SimpleDialog(props: SimpleDialogProps) {
  const { children, open, onClose } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog open={open} onClose={onClose} hideBackdrop={true} maxWidth={false} fullScreen={fullScreen}>
        {children}
    </Dialog>
  )
}
