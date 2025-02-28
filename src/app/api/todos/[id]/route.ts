import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Todo from "@/models/Todo";
import { getServerSession } from "next-auth";

// GET a specific Todo by ID
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    await dbConnect();
    
    const { id } = context.params;
    if (!id) return NextResponse.json({ error: "Missing todo ID" }, { status: 400 });

    const todo = await Todo.findById(id);
    if (!todo) return NextResponse.json({ error: "Todo not found" }, { status: 404 });

    return NextResponse.json({ todo }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { task, description, note, priority, status } = await req.json();
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: params.id, user: session.user._id },
      { task, description, note, priority, status },
      { new: true }
    );

    if (!updatedTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ todo: updatedTodo });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
  }
}

// DELETE a Todo
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    await dbConnect();
    
    const { id } = await context.params;
    console.log(id)
    if (!id) return NextResponse.json({ error: "Missing todo ID" }, { status: 400 });

    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) return NextResponse.json({ error: "Todo not found" }, { status: 404 });

    return NextResponse.json({ message: "Todo deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
