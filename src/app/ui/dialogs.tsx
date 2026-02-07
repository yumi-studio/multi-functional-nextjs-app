import { useTheme } from '@mui/material';
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      hideBackdrop={true}
      maxWidth={false}
      fullScreen={true}
      slotProps={{
        paper: {
          sx: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            minHeight: '100vh',
          },
        },
      }}
    >
      {children}
    </Dialog>
  );
}
