import type { TaskEntity } from "./task.entity";

export type CreateTaskParams = {
  userId: string;
  title: string;
  description?: string;
};

export type UpdateTaskParams = {
  userId: string;
  id: string;
  data: Partial<Pick<TaskEntity, "title" | "description" | "completed">>;
};

export interface ITaskRepository {
  create(params: CreateTaskParams): Promise<TaskEntity>;
  listByUser(userId: string): Promise<TaskEntity[]>;
  getByIdForUser(userId: string, id: string): Promise<TaskEntity | null>;
  update(params: UpdateTaskParams): Promise<TaskEntity | null>;
  deleteForUser(userId: string, id: string): Promise<boolean>;
}
