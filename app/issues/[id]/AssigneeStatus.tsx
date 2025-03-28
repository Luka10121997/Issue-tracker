'use client';
import { Issue, Status } from '@prisma/client'
import { Select } from '@radix-ui/themes'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'
import toast, { Toaster } from 'react-hot-toast'

const AssigneeStatus = ({ issue }: { issue: Issue }) => {
  const statuses: { label: string, value?: Status }[] = [
    { label: 'Open', value: 'OPEN' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Closed', value: 'CLOSED' },
  ]
  const router = useRouter()

  const assignIssueStatus = (status: string) => {
    axios.patch('/api/issues/' + issue.id, { status: status === issue.status ? null : status })
      .catch(() => { toast.error('This change could not be saved') })
    router.refresh()

  }
  return (
    <>
      <Select.Root defaultValue={issue.status}
        onValueChange={assignIssueStatus} value={issue.status}>
        <Select.Trigger placeholder='Assign...' color='gray' variant='soft' className='border-b mb-5 fixed' />
        <Select.Content className='dropDown'>
          <Select.Group>
            <Select.Label>Suggestions</Select.Label>
            {statuses.map(status =>
              <Select.Item key={status.label} value={status.value!}>{status.label}
              </Select.Item>)}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster />
    </>
  )
}

export default AssigneeStatus