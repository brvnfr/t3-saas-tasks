import { and, desc, eq } from "drizzle-orm";

import type { DB } from "@/server/db";
import { tasks } from "@/server/db/schema";

import type {
  CreateTaskParams,
  ITaskRepository,
  UpdateTaskParams,
} from "../domain/task.repository";

export class DrizzleTaskRepository implements ITaskRepository {
  constructor(private readonly db: DB) {}

  async create(params: CreateTaskParams) {
    const [row] = await this.db
      .insert(tasks)
      .values({
        userId: params.userId,
        title: params.title,
        description: params.description ?? null,
        completed: false,
      })
      .returning();

    // `.returning()` always returns the inserted row in Postgres
    return row!;
  }

  async listByUser(userId: string) {
    return this.db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt));
  }

  async getByIdForUser(userId: string, id: string) {
    const [row] = await this.db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .limit(1);

    return row ?? null;
  }

  async update(params: UpdateTaskParams) {
    const [row] = await this.db
      .update(tasks)
      .set({
        ...params.data,
      })
      .where(and(eq(tasks.id, params.id), eq(tasks.userId, params.userId)))
      .returning();

    return row ?? null;
  }

  async deleteForUser(userId: string, id: string) {
    const [row] = await this.db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning({ id: tasks.id });

    return !!row?.id;
  }
}
