// app/api/projects/[projectId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { projectId: string } }
// ) {
//   try {
//     await dbConnect();
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user?._id) {
//       return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//     }

//     const { projectId } = await params; // ✅ Correct way to extract params

//     if (!projectId) {
//       return NextResponse.json(
//         { error: "Project ID is required" },
//         { status: 400 }
//       );
//     }

//     const project = await Project.findById(projectId);
//     if (!project) {
//       return NextResponse.json({ error: "Project not found" }, { status: 404 });
//     }

//     return NextResponse.json({ project }, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


// export async function GET(
//   req: NextRequest,
//   { params }: { params: { projectId: string } }
// ) {
//   try {
//     await dbConnect();

//     const { projectId } = params; // ✅ Correct way to extract params

//     if (!projectId) {
//       return NextResponse.json(
//         { error: "Project ID is required" },
//         { status: 400 }
//       );
//     }

//     const project = await Project.findById(projectId);
//     if (!project) {
//       return NextResponse.json({ error: "Project not found" }, { status: 404 });
//     }

//     // ✅ Publicly return project (No auth check)
//     return NextResponse.json({ project }, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    await dbConnect();

    const { projectId } = params;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Find the project and increment the view count
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $inc: { count: 1 } }, // ✅ Increment the view count
      { new: true } // ✅ Return the updated document
    );

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function PUT(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    await dbConnect();
    const body = await req.json();
    const updated = await Project.findByIdAndUpdate(params.projectId, body, {
      new: true,
    }).exec();

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ project: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove Project (Only Owner)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const project = await Project.findById(params.projectId);
    if (!project)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    // Ensure the user is the owner
    if ((session.user as any)._id !== project.user.toString()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await project.deleteOne();

    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
