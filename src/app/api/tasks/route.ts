// app/api/tasks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Task from "@/models/Task";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { title, overview, status, dueDate, projectId } = await req.json();

    const newTask = new Task({
      title,
      overview,
      status,
      dueDate,
      project: projectId,
    });

    await newTask.save();

    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
