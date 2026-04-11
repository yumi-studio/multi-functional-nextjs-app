"use client";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useActionState, useEffect, useState } from "react";
import { createConversation } from "../../actions/conversations";

const AddConversationButton = () => {
  const [open, setOpen] = useState(false);
  const [state, createConversationAction, pending] = useActionState(createConversation, undefined)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (state?.data && open) {
      setOpen(false);
    }
  }, [state, open]);

  return (
    <>
      <Button size="small" type="button" variant="contained" color="secondary"
        sx={{
          padding: '0.5rem'
        }}
        onClick={handleClickOpen}
      >
        <FontAwesomeIcon icon={faPlus} width={24} height={24} />
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create new conversation</DialogTitle>
        <DialogContent>
          <form action={createConversationAction} id='create-conversation-form'>
            <TextField
              autoFocus
              required
              margin="dense"
              name="name"
              label="Name"
              type="text"
              fullWidth
              variant="standard"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="create-conversation-form" disabled={pending}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddConversationButton;
