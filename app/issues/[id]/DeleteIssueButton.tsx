'use client';
import { AlertDialog, Button, Flex } from '@radix-ui/themes'
import axios from 'axios'
import Link from 'next/link'
import React from 'react'

const DeleteIssueButton = ({ issueId }: { issueId: number }) => {
  return (

    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button color="red">Delete Issue
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>Confirm Deletion</AlertDialog.Title>
        <AlertDialog.Description>Are you sure, you want to delee this issue</AlertDialog.Description>
        <Flex mt="4" gap='3'>
          <AlertDialog.Cancel>
            <Button variant='soft' color='gray'>Cancel</Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button color='red' onClick={() => axios.delete(`/api/issues/${issueId}`)}>
              <Link href={`/issues/`}>
                Delete issue
              </Link>
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root >

  )
}

export default DeleteIssueButton