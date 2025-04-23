import { z } from 'zod'

export const isssueSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must contain at most 255 character(s)'),
  description: z.string().min(1, 'Description is required').max(65535, 'Description must contain at most 65535 character(s)')
});

export const patchIsssueSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255).optional(),
  description: z.string().min(1, 'Description is required').max(65535).optional(),
  assignedToUserId: z.string().min(1, "AssignedToUserId is required").max(255).optional().nullable(),
  comment: z.string().min(1, "Comment is required, at least one character!").max(255, "You exceed the number of characters!").optional()
});
