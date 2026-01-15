export type TaskEntity = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date | null;
};
