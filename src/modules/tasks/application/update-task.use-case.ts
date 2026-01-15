import type { ITaskRepository } from "../domain/task.repository";

export class UpdateTaskUseCase {
  constructor(private readonly repo: ITaskRepository) {}

  async execute(input: {
    userId: string;
    id: string;
    data: {
      title?: string;
      description?: string | null;
      completed?: boolean;
    };
  }) {
    return this.repo.update({
      userId: input.userId,
      id: input.id,
      data: input.data,
    });
  }
}
