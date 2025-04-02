import { Box, Button, Flex } from '@radix-ui/themes'
import Link from 'next/link'
import React from 'react'
import IssueStatusFilter from './IssueStatusFilter'
import IssueAssigneeFilter from './IssueAssigneeFilter'

const IssueActions = () => {
  return (
    <Flex mb="5" justify="between">
      <Box className='space-x-2' >
        <IssueStatusFilter />
        <IssueAssigneeFilter />
      </Box>
      <Button><Link href="/issues/new">Create New Issue</Link>
      </Button>
    </Flex>
  )
}

export default IssueActions