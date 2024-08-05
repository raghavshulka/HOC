import prisma from "@/db/prisma";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";


const TodoSchema = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().min(1, "Title is required"),
  content: z.string().nullable(),
  done: z.boolean().default(false),
  createdAt: z.date().optional(),
});

export async function GET() {
  try {
    const todos = await prisma.todos.findMany();
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = TodoSchema.parse(body);

    const newTodo = await prisma.todos.create({
      data: validatedData,
    });

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  try {
    const { id } = await req.json();
    // const validatio = TodoSchema.parse(id);
    const validatio = z.number().int().positive().parse(id);

    const data = prisma.todos.delete({
      where: { id: validatio },
    });

    if (!data) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ Message: "user not deleted" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = req.json;
    const { id, ...prevData } = TodoSchema.parse(body);

    if (id === undefined) {
      return NextResponse.json(
        { error: "ID is required for updates" },
        { status: 400 }
      );
    }

    const updatedTodo = await prisma.todos.update({
      where: { id },
      data: prevData,
    });

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { msg: "Failed to  updated user " },
      { status: 500 }
    );
  }
}

