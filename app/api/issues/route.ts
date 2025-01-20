import { NextRequest, NextResponse } from "next/server";
import { title } from "process";
import { prisma } from "@/prisma/client"
import { createdIssueSchema } from "./createdIssueSchema";

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