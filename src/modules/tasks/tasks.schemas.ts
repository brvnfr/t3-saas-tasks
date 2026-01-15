import { z } from "zod";

export const taskIdSchema = z.object({
  id: z.string().min(1),
});

export const createTaskSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
});

export const updateTaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(120).optional(),
  description: z.string().max(500).optional().nullable(),
  completed: z.boolean().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
