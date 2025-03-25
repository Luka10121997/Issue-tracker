import { prisma } from '@/prisma/client'
import { Box, Flex, Grid } from '@radix-ui/themes';
import { notFound } from 'next/navigation';
import React, { cache } from 'react'
import EditIssueButton from './EditIssueButton';
import IssueDetails from './IssueDetails';
import DeleteIssueButton from './DeleteIssueButton';
import { getServerSession } from 'next-auth'
import authOptions from '@/app/auth/authOptions';
import AssigneeSelect from './AssigneeSelect';
import AddComment from './AddComment';
// import AddCommentButton from './AddCommentButton';

interface Props {
  params: { id: string }
}

const fetchUser = cache((issueId: number) => prisma.issue.findUnique({ where: { id: issueId } }))


const IssueDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions)
  const issue = await fetchUser(parseInt(params.id))

  if (!issue) notFound()

  return (
    <Grid columns={{ initial: "1", sm: "5" }}>
      <Box className='md:col-span-4 space-y-3'>
        <IssueDetails issue={issue} />
        <AddComment issue={issue} />
      </Box>
      {session && (
        <Box>
          <Flex direction="column" gap="4" px="2">
            <AssigneeSelect issue={issue} />
            <EditIssueButton issueId={issue.id} />
            <DeleteIssueButton issueId={issue.id} />
          </Flex>
        </Box>
      )}
    </Grid >
  )
}

export async function generateMetadata({ params }: Props) {
  const issue = await fetchUser(parseInt(params.id))
  return {
    title: issue?.title,
    description: "Details of issue" + issue?.id
  }
}

export default IssueDetailPage 