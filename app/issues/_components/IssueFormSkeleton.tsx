import { Box } from '@radix-ui/themes'
import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const IssueFormSkeleton = () => {
  return (
    <Box className='max-w-xl'>
      <Skeleton height="2rem" />
      <Skeleton height="15rem" />

    </Box>
  )
}

export default IssueFormSkeleton