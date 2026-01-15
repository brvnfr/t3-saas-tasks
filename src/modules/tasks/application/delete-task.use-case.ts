import type { ITaskRepository } from "../domain/task.repository";

export class DeleteTaskUseCase {
  constructor(private readonly repo: ITaskRepository) {}

  async execute(input: { userId: string; id: string }) {
    return this.repo.deleteForUser(input.userId, input.id);
  }
}
