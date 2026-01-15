import type { ITaskRepository } from "../domain/task.repository";

export class CreateTaskUseCase {
  constructor(private readonly repo: ITaskRepository) {}

  async execute(input: { userId: string; title: string; description?: string }) {
    return this.repo.create(input);
  }
}
