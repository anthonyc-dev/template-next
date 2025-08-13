import { NextResponse } from "next/server";

type Todo = { id: string; title: string; completed: boolean };

let todos: Todo[] = [
  { id: "1", title: "Try the dark mode toggle", completed: false },
  { id: "2", title: "Add, edit, and delete todos", completed: false },
];

export async function GET() {
  return NextResponse.json({ todos });
}

export async function POST(request: Request) {
  const body = await request.json();
  const title = String(body?.title || "").trim();
  if (!title)
    return NextResponse.json({ message: "Title required" }, { status: 400 });
  const newTodo: Todo = { id: String(Date.now()), title, completed: false };
  todos.unshift(newTodo);
  return NextResponse.json({ todo: newTodo }, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const id = String(body?.id || "");
  const title = typeof body?.title === "string" ? body.title : undefined;
  const completed =
    typeof body?.completed === "boolean" ? body.completed : undefined;
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  todos[idx] = {
    ...todos[idx],
    ...(title !== undefined ? { title } : {}),
    ...(completed !== undefined ? { completed } : {}),
  };
  return NextResponse.json({ todo: todos[idx] });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });
  todos = todos.filter((t) => t.id !== id);
  return NextResponse.json({ ok: true });
}
