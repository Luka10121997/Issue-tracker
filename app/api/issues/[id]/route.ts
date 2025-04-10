import { patchIsssueSchema } from "@/app/validationSchemas";
import { prisma } from "@/prisma/client";
import { Status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(request: NextRequest,
  { params }: { params: { id: string } }) {

  const body = await request.json()
  const validation = patchIsssueSchema.safeParse(body)

  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 })

  //Validate user
  const { assignedToUserId, title, description, comment, status } = body

  if (assignedToUserId) {
    const user = await prisma.user.findUnique({
      where: { id: assignedToUserId }
    })

    if (!user)
      return NextResponse.json({ error: "Invalid user" }, { status: 400 })
  }

  //Validate issue
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) }
  })

  if (!issue)
    return NextResponse.json({ error: "Invalid issue" }, { status: 404 })

  if (assignedToUserId != null) {
    const updatedIssue = await prisma.issue.update({
      where: { id: issue.id },
      data: {
        title,
        description,
        assignedToUserId,
        comment,
        status: Status.IN_PROGRESS
      }
    })

    return NextResponse.json(updatedIssue)
  }

  else {
    const updatedIssue = await prisma.issue.update({
      where: { id: issue.id },
      data: {
        title,
        description,
        assignedToUserId,
        comment,
        status
      }
    })
    return NextResponse.json(updatedIssue)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {

  //Catch issue id
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) }
  })

  if (!issue)
    return NextResponse.json({ error: "Invalid issue" }, { status: 404 })

  await prisma.issue.delete({
    where: { id: issue.id }
  })

  return NextResponse.json({});
}


//TODO Refactor if() else for updating issue part