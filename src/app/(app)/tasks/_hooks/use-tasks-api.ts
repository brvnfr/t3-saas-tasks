import { api } from "@/trpc/react";

export const useTasksApi = () => {
  const utils = api.useUtils();

  const { data: tasks, isLoading } = api.task.list.useQuery();

  const createTask = api.task.create.useMutation({
    onSuccess: async () => {
      await utils.task.list.invalidate();
    },
  });

  const updateTask = api.task.update.useMutation({
    onSuccess: async () => {
      await utils.task.list.invalidate();
    },
  });

  const deleteTask = api.task.delete.useMutation({
    onSuccess: async () => {
      await utils.task.list.invalidate();
    },
  });

  const toggleCompleted = async (id: string, completed: boolean) => {
    await updateTask.mutateAsync({ id, completed: !completed });
  };

  return {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    toggleCompleted,
  };
};
