import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "@/lib/dbConnect";
import Todo from "@/models/Todo";

// Fetch all todos
export async function GET() {
  try {
    await dbConnect();
    const todos = await Todo.find().sort({ createdAt: -1 });

    return NextResponse.json({ todos }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
