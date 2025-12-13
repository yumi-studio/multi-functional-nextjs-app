"use client";

import { Button, Card, CardContent, FormGroup, Input } from "@mui/material";

export default function User() {
  return (
    <Card variant="outlined">
      <CardContent>
        <div>User</div>
        <FormGroup row>
          <Input id="my-input" aria-describedby="my-helper-text" placeholder='Username' />
          <Button variant='contained'>Login</Button>
        </FormGroup>
      </CardContent>
    </Card>
  )
}