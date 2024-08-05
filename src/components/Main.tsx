import { PrismaClient } from "@prisma/client";
import { todoTypes } from "@/db/todos.types";

const prisma = new PrismaClient();

async function getTodos(): Promise<todoTypes[]> {
  try {
    const todos = await prisma.todos.findMany();
    return todos;
  } catch (e) {
    console.error("Failed to fetch todos:", e);
    return [];
  }
}

export default async function Main() {
  const todos = await getTodos();

  return (
    <div className="flex flex-col justify-center h-screen">
      <div className="flex justify-center">
        <div className="border p-8 rounded">
          {todos.map((todo) => (
            <div key={todo.id} className="mb-4">
              <h2 className="text-xl font-bold">{todo.title}</h2>
              <p>{todo.content}</p>
              <p>Status: {todo.done ? "Completed" : "Pending"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
