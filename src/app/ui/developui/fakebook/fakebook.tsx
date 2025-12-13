"use client";

import { Button, Card, CardContent, FormGroup, Input } from "@mui/material";

export default function Fakebook() {
  return (
    <Card variant="outlined">
      <CardContent>
        <div>Fakebook</div>
        <FormGroup row>
          <Input id="my-input" aria-describedby="my-helper-text" placeholder='Username' />
          <Button variant='contained'>Login</Button>
        </FormGroup>
      </CardContent>
    </Card>
  )
}