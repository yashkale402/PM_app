import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // adjust path as needed
import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/Project";

// GET: We'll return only the "most recent" 5 by creation date
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user._id;

    // Return the most recent 5 projects
    const projects = await Project.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: create a new project
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user._id;

    const { name, overview, status, timeline, githubLink, liveSite ,count } = await req.json();

    const newProject = await Project.create({
      name,
      overview,  // Storing Markdown format
      status,
      timeline,
      user: userId,
      githubLink,
      liveSite,
      count
    });

    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}