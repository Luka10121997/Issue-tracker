import IssueStatusBadge from '@/app/components/IssueStatusBadge'
import { prisma } from '@/prisma/client'
import { Issue } from '@prisma/client'
import { Card, Flex, Heading, Text } from '@radix-ui/themes'
import { cache } from 'react'
import ReactMarkdown from 'react-markdown'

interface Props {
  params: {
    id: string
  }
}

const IssueDetails = ({ issue }: { issue: Issue }) => {
  return (
    <>
      <Heading>{issue.title}</Heading>
      <Flex className='space-x-2 my-6'>
        <IssueStatusBadge status={issue.status} />
        <Text mt='-1'>{issue.createdAt.toDateString()}</Text>
      </Flex>
      <Card className='prose max-w-full' mt='-4'>
        <ReactMarkdown>{issue.description}</ReactMarkdown>
      </Card>
      {issue.comment && <Heading>Added comment :</Heading>}
      {issue.comment && <Card className='prose max-w-full'>
        {issue.comment}
      </Card>}
    </>
  )
}


export default IssueDetails