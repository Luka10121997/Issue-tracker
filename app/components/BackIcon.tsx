import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { Button } from '@radix-ui/themes'
import { url } from 'inspector/promises'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

const BackIcon = () => {
  const url = usePathname()
  const router = useRouter()
  return (
    <Button color='gray' variant='soft' disabled={url === '/'} onClick={() => router.back()}>
      <ChevronLeftIcon />
    </Button>
  )
}

export default BackIcon