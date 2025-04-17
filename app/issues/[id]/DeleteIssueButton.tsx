'use client';
import { AlertDialog, Button, Flex } from '@radix-ui/themes'
import axios from 'axios'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import Spinner from '@/app/components/Spinner';
import toast, { Toaster, } from 'react-hot-toast';

const DeleteIssueButton = ({ issueId }: { issueId: number }) => {
  const router = useRouter();
  const [error, setError] = useState(false)
  const [isDeleting, setDeleting] = useState(false)

  const showSuccessToastMessage = () => {

    toast.success("Issue is successfully deleted", {
      position: 'bottom-right',
      className: 'toastify__toast-container',
      duration: 3000
    });

  };

  const deleteIssue = async () => {
    try {
      setDeleting(true)
      showSuccessToastMessage()
      axios.delete(`/api/issues/${issueId}`)
      router.push('/issues/list')
      router.refresh()
    } catch (error) {
      setDeleting(false)
      setError(true)
    }
  }

  return (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button color="red" disabled={isDeleting}>Delete Issue
            {isDeleting && <Spinner />}
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>Confirm Deletion</AlertDialog.Title>
          <AlertDialog.Description>Are you sure, you want to delete this issue</AlertDialog.Description>
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
      <Toaster />
    </>
  )
}

export default DeleteIssueButton