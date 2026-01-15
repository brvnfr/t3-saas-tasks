import type { ITaskRepository } from "../domain/task.repository";

export class ListTasksUseCase {
  constructor(private readonly repo: ITaskRepository) {}

  async execute(input: { userId: string }) {
    return this.repo.listByUser(input.userId);
  }
}
