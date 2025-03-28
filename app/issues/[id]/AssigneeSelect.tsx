'use client';
import { Issue, User } from '@prisma/client';
import { Select, Skeleton } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getWaitUntilPromiseFromEvent } from 'next/dist/server/web/spec-extension/fetch-event';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const { data: users, error, isLoading } = useUsers()
  const router = useRouter()

  if (isLoading) return <Skeleton />

  if (error) return null

  const assignIssue = (userId: string) => {
    axios.patch('/api/issues/' + issue.id, { assignedToUserId: userId === "unassigned" ? null : userId })
      .catch(() => { toast.error('This change could not be saved') })
    router.refresh()

  }

  return (
    <>
      <Select.Root defaultValue={issue.assignedToUserId || "unassigned"}
        onValueChange={assignIssue}>
        <Select.Trigger placeholder='Assign...' />
        <Select.Content>
          <Select.Group>
            <Select.Label>Suggestions</Select.Label>
            <Select.Item value="unassigned">Unassigned</Select.Item>
            {users?.map(user =>
              <Select.Item key={user.id} value={user.id}>{user.name}
              </Select.Item>)}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster />
    </>
  )

}
const useUsers = () =>
  useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => axios.get('/api/users').then(res => res.data),
    staleTime: 60 * 1000, //60 sec
    retry: 3
  })

export default AssigneeSelect