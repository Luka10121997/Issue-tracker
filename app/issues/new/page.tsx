import { prisma } from '@/prisma/client'
import IssueForm from '../_components/IssueForm'
import { notFound } from 'next/navigation';
import { Issue } from '@prisma/client';


const NewIssuePage = async ({ issue }: { issue: Issue }) => {

  return (
    <IssueForm />
  )
}

export default NewIssuePage