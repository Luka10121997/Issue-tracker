import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client"
import { isssueSchema } from "../../validationSchemas";
import { getServerSession } from 'next-auth'
import authOptions from "@/app/auth/authOptions";


export async function POST(request: NextRequest) {

  const session = await getServerSession(authOptions)

  if (!session)
    return NextResponse.json({}, { status: 401 })

  const body = await request.json()

  const validation = isssueSchema.safeParse(body)

  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  const newCreatedIssue = await prisma.issue.create({
    data: { title: body.title, description: body.description }
  })

  return NextResponse.json(newCreatedIssue, { status: 201 })
}
