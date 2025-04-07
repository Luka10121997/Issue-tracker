'use client';
import { Select, Skeleton } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
import { User } from '@prisma/client';

const IssueAssigneeFilter = () => {
  const { data: users, error } = useUsers()
  const router = useRouter();
  const searchParams = useSearchParams()


  if (error) return null

  return (
    <Select.Root
      defaultValue={searchParams.get('user')! || ''}
      onValueChange={(user) => {
        const params = new URLSearchParams()
        if (user) params.append('user', user)

        if (searchParams.get('orderBy'))
          params.append('orderBy', searchParams.get('orderBy')!)

        if (searchParams.get('status'))
          params.append('status', searchParams.get('status')!)

        const query = params.size ? '?' + params.toString() : ''
        router.push('/issues/list' + query)
      }}>
      <Select.Trigger placeholder='Filter by assigned user...' />
      <Select.Content className='listDropDown'>
        <Select.Item value="unassigned">Unassigned</Select.Item>
        {users?.map(user =>
        (
          <Select.Item
            key={user.id || "unassigned"} value={user.id || "unassigned"}>{user.name}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  )
}
export const useUsers =
  () =>
    useQuery<User[]>({
      queryKey: ['users'],
      queryFn: () => axios.get('/api/users').then(res => res.data),
      staleTime: 60 * 1000, //60 sec
      retry: 3
    })


export default IssueAssigneeFilter