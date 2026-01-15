"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TaskListItem = {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  createdAt: Date;
};

type TaskListProps = {
  items: TaskListItem[];
  isLoading?: boolean;
  onToggleCompleted: (id: string, completed: boolean) => Promise<void>;
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  isDeletingId?: string | null;
};

export const TaskList = ({
  items,
  isLoading,
  onToggleCompleted,
  onEdit,
  onDelete,
  isDeletingId,
}: TaskListProps) => {
  if (isLoading) return <div className="text-sm text-muted-foreground">Carregando...</div>;

  if (!items?.length) return <div className="text-sm text-muted-foreground">Nenhuma task ainda.</div>;

  return (
    <div className="space-y-3">
      {items.map((t) => (
        <div key={t.id} className="rounded-md border p-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleCompleted(t.id, t.completed)}
                  className={cn(
                    "h-4 w-4 rounded border",
                    t.completed ? "bg-primary border-primary" : "bg-background",
                  )}
                  aria-label={t.completed ? "Marcar como pendente" : "Marcar como concluída"}
                />
                <div className={cn("font-medium truncate", t.completed && "line-through text-muted-foreground")}>
                  {t.title}
                </div>
              </div>

              {t.description ? (
                <div className={cn("mt-1 text-sm", t.completed ? "text-muted-foreground" : "text-muted-foreground/80")}>
                  {t.description}
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => onEdit(t.id)}>
                Editar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(t.id)}
                disabled={isDeletingId === t.id}
              >
                {isDeletingId === t.id ? "Excluindo..." : "Excluir"}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
