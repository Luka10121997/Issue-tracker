'use client';
import ErrorMessage from '@/app/components/ErrorMessage';
import { isssueSchema } from '@/app/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Issue } from '@prisma/client';
import { Box, Button, Callout, Spinner, TextField } from '@radix-ui/themes';
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster, } from 'react-hot-toast';
import SimpleMDE from 'react-simplemde-editor';
import { z } from 'zod';


type IssueFormData = z.infer<typeof isssueSchema>


const IssueForm = ({ issue }: { issue?: Issue }) => {
  const router = useRouter();
  const { register, control, handleSubmit, formState: { errors } } = useForm<IssueFormData>({
    resolver: zodResolver(isssueSchema)
  });
  const [error, setError] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const showSuccessToastMessage = () => {
    if (!issue) {
      toast.success("Issue is successfully created", {
        position: 'bottom-right',
        className: 'toastify__toast-container',
        duration: 3000
      });
    }
    else {
      toast.success("Issue is successfully updated", {
        position: 'bottom-right',
        className: 'toastify__toast-container',
        duration: 3000
      });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true)
      showSuccessToastMessage()

      if (issue)
        await axios.patch('/api/issues/' + issue.id, data)
      else
        await axios.post('/api/issues', data);

      router.push('/issues/list');
      router.refresh();

    } catch (error) {
      setSubmitting(false)
      setError('An unexpected error occurs')
    }
  })

  return (
    <div className='max-w-xl'>
      {error && (< Callout.Root color='red' className='mb-5'>
        <Callout.Text>{error}</Callout.Text>
      </Callout.Root>)}
      <form className="space-y-3"
        onSubmit={onSubmit}>
        <Box maxWidth="200px">
          <TextField.Root size="1" defaultValue={issue?.title} placeholder="Title" {...register('title')} />
          <ErrorMessage>
            {errors.title?.message}
          </ErrorMessage>
        </Box>
        <Controller
          name='description'
          control={control}
          defaultValue={issue ? issue.description : ''}
          render={({ field }) => <SimpleMDE placeholder="Description" {...field} />
          }
        />
        <ErrorMessage>
          {errors.description?.message}
        </ErrorMessage>
        <Button disabled={isSubmitting}>
          {issue ? 'Update issue' : 'Submit New Issue'}{''}{isSubmitting && <Spinner />}</Button>
        <Toaster />
      </form>
    </div >
  );
}

export default IssueForm;