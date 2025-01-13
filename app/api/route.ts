import { NextRequest, NextResponse } from "next/server";
import { title } from "process";
import { z } from 'zod';
import { prisma } from "@/prisma/client"

const createdIssueSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1)
})

export async function POST(request: NextRequest) {
  const body = await request.json()
  const validation = createdIssueSchema.safeParse(body)
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });
  const newCreatedIssue = await prisma.issue.create({
    data: { title: body.title, description: body.description }
  })
  return NextResponse.json(newCreatedIssue, { status: 201 })
}