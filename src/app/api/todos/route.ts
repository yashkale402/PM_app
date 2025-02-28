import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "@/lib/dbConnect";
import Todo from "@/models/Todo";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    console.log(session)
    if (!session || !session.user?._id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user._id;
    console.log(userId)

    // Return the most recent 5 todos
    const todos = await Todo.find()
      .sort({ createdAt: -1 })
      .limit(5);

      console.log(todos)
    return NextResponse.json({ todos }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?._id) {
      console.log("Not authenticated or no user._id");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Request body:", body);

    const { task, description, note, priority, status } = body;

    // Check if essential fields are missing
    if (!task) {
      return NextResponse.json({ error: "Task field is required" }, { status: 400 });
    }

    const newTodo = await Todo.create({
      user: session.user._id,
      task,
      description,
      note,
      priority,
      status: status || "active",
    });

    console.log("Created new todo:", newTodo);
    return NextResponse.json({ todo: newTodo }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating todo:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}