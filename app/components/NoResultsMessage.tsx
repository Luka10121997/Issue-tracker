import { Text } from '@radix-ui/themes'
import React, { PropsWithChildren } from 'react'


const NoResults = ({ children }: PropsWithChildren) => {
  if (!children) return null;

  return (
    <Text color='gray' as='p' size="3" className='font-bold' >{children}</Text>
  )
}

export default NoResults