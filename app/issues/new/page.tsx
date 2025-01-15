'use client';
import React from 'react';
import { Box, Button, TextField } from '@radix-ui/themes';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";


const NewIssuePage = () => {
  return (

    <div className="max-w-xl space-y-3">
      <Box maxWidth="200px">
        <TextField.Root size="1" placeholder="Title" />
      </Box>
      <SimpleMDE placeholder="Reply to comment…" />
      <Button>Submit New Issue</Button>
    </div>
  );
}

export default NewIssuePage;