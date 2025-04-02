import React from 'react'
import { prisma, } from '@/prisma/client'
import IssueActions from './IssueActions'
import { Issue, Status, User } from '@prisma/client'
import Pagination from '@/app/components/Pagination'
import IssueTable from './IssueTable'
import { Metadata } from 'next'

export type SearchParams = Promise<{ status: Status, orderBy: keyof Issue, page: string, user: string }>;

interface Props {
  searchParams: SearchParams;
  issues: Issue[]
}

export const columns: {
  label: string;
  value: keyof Issue;
  className?: string;

}[] =
  [
    { label: 'Issue', value: 'title' },
    { label: 'Status', value: 'status', className: 'hidden md:table-cell' },
    { label: 'Created', value: 'createdAt', className: 'hidden md:table-cell' },
    { label: "Comments", value: 'comment', className: 'hidden md:table-cell' }
  ]

const IssuesPage = async (props: Props) => {
  const searchParams = await props.searchParams;
  const statuses = Object.values(Status);

  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  const user = await prisma.user.findUnique(
    {
      where: { id: searchParams.user || '' }

    }
  )

  const assignedToUserId = user?.id?.includes(searchParams.user)
    ? user.id
    : undefined

  const where = { status, assignedToUserId }

  const orderBy = columns.map(column => column.value)
    .includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: 'asc' } : undefined

  const page = parseInt(searchParams.page) || 1
  const pageSize = 10


  const issues = await prisma.issue.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize
  }
  );

  const issueCount = await prisma.issue.count({ where })
  return (
    <div>
      <IssueActions />
      <IssueTable searchParams={props.searchParams} issues={issues} />
      <Pagination
        pageSize={pageSize}
        currentPage={page}
        itemCount={issueCount}
      />
    </div >
  )
}

export const metadata: Metadata = {
  title: 'Issue Tracker - Issue List',
  description: 'View all project issues'
}

export default IssuesPage

