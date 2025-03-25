'use client';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';
import { patchIsssueSchema } from '@/app/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Issue } from '@prisma/client';
import { Box, Button, Callout, TextArea } from '@radix-ui/themes';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type IssueFormData = z.infer<typeof patchIsssueSchema>

const AddComment = ({ issue }: { issue: Issue }) => {
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<IssueFormData>({
    resolver: zodResolver(patchIsssueSchema)
  });
  const [isCommenting, commenting] = useState(false);
  const [error, setError] = useState('');

  const submitComment = handleSubmit(async (data, e) => {
    try {
      commenting(true)
      await axios.patch('/api/issues/' + issue.id, data)
      router.refresh()
      commenting(false)
      e?.target.reset()

    }
    catch (error) {
      commenting(false)
      setError('An unexpected error occurs')
    }
  })

  return (
    <div className='max-w-xl'>
      {error && (< Callout.Root color='red' className='mb-5'>
        <Callout.Text>{error}</Callout.Text>
      </Callout.Root>)}
      <form onSubmit={submitComment}>
        <Box maxWidth="200px" className='space-y-2'>
          <TextArea size="1" placeholder="Add comment for an issue…" {...register('comment')} disabled={isCommenting} />
          <ErrorMessage>
            {errors.comment?.message}
          </ErrorMessage>
          <Button disabled={isCommenting} >
            Add comment
            {isCommenting && <Spinner />}
          </Button>
        </Box>

      </form>
    </div>
  )
}

export default AddComment