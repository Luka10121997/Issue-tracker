'use client';
import React from 'react';
import { Box, Button, TextArea, TextField } from '@radix-ui/themes';

const NewIssuePage = () => {
  return (

    <div className="max-w-xl space-y-3">
      <Box maxWidth="200px">
        <TextField.Root size="1" placeholder="Title" />
      </Box>
      <TextArea placeholder="Reply to comment…" />
      <Button>Submit New Issue</Button>
    </div>
  );
}

export default NewIssuePage;