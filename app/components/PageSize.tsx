'use client';
import { Select } from '@radix-ui/themes'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'


export const pageSizes: {
  label: string,
  value: number
}[] = [{ label: "1", value: 1 }, { label: '5', value: 5 }, { label: '10', value: 10 }]


const PageSize = () => {

  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <Select.Root size='2' defaultValue={searchParams.get('size')! || ''}
      onValueChange={(size) => {
        const params = new URLSearchParams()
        if (size) params.append('size', size)

        if (searchParams.get('orderBy'))
          params.append('orderBy', searchParams.get('orderBy')!)

        if (searchParams.get('status'))
          params.append('status', searchParams.get('status')!)

        if (searchParams.get('user'))
          params.append('user', searchParams.get('user')!)

        const query = params.size ? '?' + params.toString() : ''
        router.push('/issues/list' + query)
      }}>
      <Select.Trigger placeholder='Select page size...' />
      <Select.Content className='pageSizeDropdown'>
        <Select.Group>
          <Select.Label>Suggestions</Select.Label>
          {pageSizes?.map(size =>
            <Select.Item key={size.label} value={size.label}>{size.label}
            </Select.Item>)}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  )
}

export default PageSize