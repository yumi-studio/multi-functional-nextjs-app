"use client";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useActionState, useEffect, useState } from "react";
import { createConversation } from "../../actions/conversations";
import { useConversationStore } from "../../stores/conversation-store";

const AddConversationButton = () => {
  const [open, setOpen] = useState(false);
  const [state, createConversationAction, pending] = useActionState(createConversation, undefined)
  const conversations = useConversationStore(state => state.conversations);
  const setConversations = useConversationStore(state => state.setConversations);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (state?.data && open) {
      setConversations([...conversations, state.data]);
      setTimeout(() => setOpen(false), 100);
    }
  }, [state, open]);

  return (
    <>
      <div className="flex items-center">
        <Button size="small" type="button" variant="contained" color="secondary"
          onClick={handleClickOpen}
          fullWidth
          sx={{
            height: '42px',
            p: '0.5rem',
            borderRadius: 0,
          }}
        >
          <FontAwesomeIcon icon={faPlus} width='1rem' height='1rem' fontSize='1rem'/>
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
      </div>
    </>
  );
}

export default AddConversationButton;
