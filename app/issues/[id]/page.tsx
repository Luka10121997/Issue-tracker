import IssueStatusBadge from '@/app/components/IssueStatusBadge';
import { prisma } from '@/prisma/client'
import { Card, Flex, Heading, Text } from '@radix-ui/themes';
import { notFound } from 'next/navigation';
import React from 'react'
import ReactMarkDown from 'react-markdown'
import delay from 'delay';

interface Props {
  params: { id: string }
}
const IssueDetailPage = async ({ params }: Props) => {
  // if (typeof params.id === 'number') notFound()
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) }
  });
  if (!issue)
    notFound()

  await delay(2000)
  return (
    <div>
      <Heading>{issue.title}</Heading>
      <Flex className='space-x-2 my-6'>
        <IssueStatusBadge status={issue.status} />
        <Text mt='-1'>{issue.createdAt.toDateString()}</Text>
      </Flex>
      <Card className='prose' mt='-4'>
        <ReactMarkDown>{issue.description}</ReactMarkDown>
      </Card>
    </div>
  )
}

export default IssueDetailPage 