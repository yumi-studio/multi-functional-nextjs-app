"use client";

import { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Collapse, Button, Box, Card, CardContent, CardHeader, FormControl, InputLabel, Input, FormHelperText, FormGroup, FormLabel } from "@mui/material";
import User from './developui/user';

export default function DevelopUi({ children }: { children?: React.ReactNode }) {
  const coreRef = useRef(null);
  const [open, setOpen] = useState(true);
  return (
    <>
      <div className="fixed top-0 left-0 w-svw z-[99998]">
        <Draggable
          handle=".drag-area"
          defaultPosition={{ x: 15, y: 15 }}
          nodeRef={coreRef}>
          <div ref={coreRef} className="absolute flex items-center justify-between bg-white p-2 gap-2">
            <span className="drag-area">Develop Tool</span>
            <Button onClick={() => setOpen(true)} sx={{ p: 0 }} variant='contained'>
              {open ? "Hide" : "Show"}
            </Button>
          </div>
        </Draggable>
      </div>
      <div className={
        "develop-content fixed top-0 left-0 w-svw h-svh overflow-auto bg-white z-[99999] " +
        (open ? "block " : "hidden ")
      }>
        <div>
          <Button onClick={() => setOpen(false)} variant='contained'>Close</Button>
        </div>
        {children}
      </div>
    </>
  )
}