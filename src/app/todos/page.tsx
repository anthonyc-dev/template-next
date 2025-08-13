"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";

type Todo = { id: string; title: string; completed: boolean };

export default function TodosPage() {
  const queryClient = useQueryClient();
  const [newTitle, setNewTitle] = useState("");

  const { data, isLoading } = useQuery<{ todos: Todo[] }>({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await api.get("/api/todos");
      return res.data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (title: string) => {
      const res = await api.post("/api/todos", { title });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const toggleMutation = useMutation({
    mutationFn: async (todo: Todo) => {
      const res = await api.put("/api/todos", {
        id: todo.id,
        completed: !todo.completed,
      });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/todos?id=${id}`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    await addMutation.mutateAsync(title);
    setNewTitle("");
  };

  return (
    <div className="mx-auto max-w-2xl w-full p-4 sm:p-6 grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Todos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form className="flex gap-2" onSubmit={onAdd}>
            <Input
              placeholder="Add a todo"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Button type="submit" disabled={addMutation.isPending}>
              Add
            </Button>
          </form>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <ul className="grid gap-2">
              {(data?.todos || []).map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between gap-3 border rounded-md px-3 py-2"
                >
                  <button
                    className="text-left flex-1 hover:underline"
                    onClick={() => toggleMutation.mutate(t)}
                    aria-pressed={t.completed}
                  >
                    {t.completed ? "✅ " : "⭕ "}
                    {t.title}
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(t.id)}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
