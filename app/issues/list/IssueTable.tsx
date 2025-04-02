import IssueStatusBadge from '@/app/components/IssueStatusBadge'
import { ArrowUpIcon } from '@radix-ui/react-icons'
import { Table } from '@radix-ui/themes'
import Link from 'next/link'
import React from 'react'
import NextLink from 'next/link'
import { Issue } from '@prisma/client'
import { columns, SearchParams } from './page';
import NoResults from '@/app/components/NoResultsMessage'

interface Props {
  searchParams: SearchParams;
  issues: Issue[]
}

const IssueTable = async ({ searchParams, issues }: Props) => {
  const orderBy = (await searchParams).orderBy
  return (
    <Table.Root variant='surface'>
      <Table.Header>
        <Table.Row>
          {columns.map(async column => <Table.ColumnHeaderCell key={column.value} className={column.className}>
            <NextLink href={{
              query: { ...await searchParams, orderBy: column.value }
            }}>
              {column.label}
            </NextLink>
            {column.value === orderBy && <ArrowUpIcon className='inline' />}
          </Table.ColumnHeaderCell>)}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {issues.map(issue => (
          <Table.Row key={issue.id}>
            <Table.Cell className='myClass'>
              <Link href={`/issues/${issue.id}`}>
                {issue.title}
              </Link>
              <div className='block md:hidden  myClass'>
                <IssueStatusBadge status={issue.status} />
              </div>
            </Table.Cell>
            <Table.Cell className='hidden md:table-cell'>
              <IssueStatusBadge status={issue.status} />
            </Table.Cell>
            <Table.Cell className='hidden md:table-cell myClass' >{issue.createdAt.toDateString()}</Table.Cell>
            <Table.Cell className='hidden md:table-cell myClass'>{issue.comment}</Table.Cell>
          </Table.Row>
        ))}
        {issues.length === 0 && (<Table.Row>
          <Table.Cell>
            <NoResults>
              No issues found !
            </NoResults>
          </Table.Cell>
        </Table.Row>)}
      </Table.Body>
    </Table.Root>
  )
}

export default IssueTable