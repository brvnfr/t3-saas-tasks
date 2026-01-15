"use client";

import { useMemo, useState } from "react";

import type { CreateTaskInput } from "@/modules/tasks/tasks.schemas";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { TaskCreateForm } from "./_components/task-create-form";
import { TaskEditSheet, type TaskEditSheetTask } from "./_components/task-edit-sheet";
import { TaskList } from "./_components/task-list";
import { useTasksApi } from "./_hooks/use-tasks-api";

export default function TasksPage() {
  const { tasks, isLoading, createTask, updateTask, deleteTask, toggleCompleted } = useTasksApi();

  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingTask = useMemo<TaskEditSheetTask | null>(() => {
    const t = tasks?.find((x) => x.id === editingId) ?? null;
    if (!t) return null;
    return { id: t.id, title: t.title, description: t.description };
  }, [tasks, editingId]);

  const openEdit = (id: string) => {
    setEditingId(id);
    setEditOpen(true);
  };

  const handleCreate = async (values: CreateTaskInput) => {
    await createTask.mutateAsync(values);
  };

  const handleEdit = async (id: string, values: CreateTaskInput) => {
    await updateTask.mutateAsync({ id, title: values.title, description: values.description ?? null });
  };

  const handleDelete = async (id: string) => {
    await deleteTask.mutateAsync({ id });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Criar task</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskCreateForm onSubmit={handleCreate} isPending={createTask.isPending} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Minhas tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <TaskList
            items={tasks ?? []}
            isLoading={isLoading}
            onToggleCompleted={toggleCompleted}
            onEdit={openEdit}
            onDelete={handleDelete}
            isDeletingId={deleteTask.variables?.id ?? null}
          />
        </CardContent>
      </Card>

      <TaskEditSheet
        open={editOpen}
        task={editingTask}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditingId(null);
        }}
        onSubmit={handleEdit}
        isPending={updateTask.isPending}
      />
    </div>
  );
}
