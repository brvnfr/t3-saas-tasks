import { TRPCError } from "@trpc/server";

import { createTaskSchema, taskIdSchema, updateTaskSchema } from "@/modules/tasks/tasks.schemas";
import {
  CreateTaskUseCase,
  DeleteTaskUseCase,
  ListTasksUseCase,
  UpdateTaskUseCase,
} from "@/modules/tasks/application";
import { makeTaskRepository } from "@/modules/tasks/infra/task-repository.factory";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const taskRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const repo = makeTaskRepository(ctx.db);
    return new ListTasksUseCase(repo).execute({ userId: ctx.session.user.id });
  }),

  create: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const repo = makeTaskRepository(ctx.db);
      return new CreateTaskUseCase(repo).execute({
        userId: ctx.session.user.id,
        title: input.title,
        description: input.description,
      });
    }),

  update: protectedProcedure
    .input(updateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const repo = makeTaskRepository(ctx.db);
      const task = await new UpdateTaskUseCase(repo).execute({
        userId: ctx.session.user.id,
        id: input.id,
        data: {
          title: input.title,
          description: input.description,
          completed: input.completed,
        },
      });

      if (!task) throw new TRPCError({ code: "NOT_FOUND" });
      return task;
    }),

  delete: protectedProcedure
    .input(taskIdSchema)
    .mutation(async ({ ctx, input }) => {
      const repo = makeTaskRepository(ctx.db);
      const ok = await new DeleteTaskUseCase(repo).execute({
        userId: ctx.session.user.id,
        id: input.id,
      });

      if (!ok) throw new TRPCError({ code: "NOT_FOUND" });
      return { ok: true };
    }),
});
