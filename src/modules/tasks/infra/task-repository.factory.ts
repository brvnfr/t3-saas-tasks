import type { DB } from "@/server/db";

import { DrizzleTaskRepository } from "./drizzle-task.repository";

export function makeTaskRepository(db: DB) {
  return new DrizzleTaskRepository(db);
}
