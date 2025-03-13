'use client';
import { AlertDialog, Button, Flex } from '@radix-ui/themes'
import axios from 'axios'
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';



const DeleteIssueButton = ({ issueId }: { issueId: number }) => {
  const router = useRouter();
  const [error, setError] = useState(false)
  const deleteIssue = async () => {
    try {
      axios.delete(`/api/issues/${issueId}`)
      router.push('/issues')
      router.refresh()
    } catch (error) {
      setError(true)
    }
  }

  return (
    <>
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
              <Button color='red' onClick={deleteIssue}>

                Delete issue
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root >
      <AlertDialog.Root open={error}>
        <AlertDialog.Content>
          <AlertDialog.Title>
            Error
          </AlertDialog.Title>
          <AlertDialog.Description>
            This issue could not be deleted
          </AlertDialog.Description>
          <Button mt='2' color='gray' variant='soft' onClick={async () => { setError(false) }}>OK</Button>
        </AlertDialog.Content>
      </AlertDialog.Root >
    </>
  )
}

export default DeleteIssueButton