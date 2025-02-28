"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { ArrowLeft, Trash2 } from "lucide-react"; // Import back arrow icon

type Project = {
  _id: string;
  name: string;
  overview: string;
  status: string;
  timeline: string;
  user: string; // Owner's user ID
  githubLink?: string;
  liveSite?: string;
};

interface SessionUser {
  _id: string;
  name?: string;
  email?: string;
  image?: string;
}

export default function ProjectDetailPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const { projectId } = useParams() as { projectId: string };

  const [project, setProject] = useState<Project | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ✅ Added loading state

  useEffect(() => {
    if (sessionStatus !== "loading") {
      fetchProject();
    }
  }, [sessionStatus]); // ✅ Fetch project after session is loaded

  const sessionUser = session?.user as SessionUser | undefined;

  async function fetchProject() {
    try {
      setIsLoading(true); // ✅ Start loading
      const res = await fetch(`/api/projects/${projectId}`);
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Project not found");
        return router.push("/dashboard");
      }

      setProject(data.project);

      // ✅ Check if session user is the owner
      if (sessionStatus === "authenticated" && sessionUser?._id === data.project.user) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading project.");
    } finally {
      setIsLoading(false); // ✅ Stop loading after fetch
    }
  }

  function handleEdit() {
    router.push(`/project/${projectId}/edit`);
  }

  function handleBack() {
    router.push("/dashboard/projects");
  }

  async function handleDelete() {
    const confirmDelete = confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Project deleted successfully!");
        router.push("/dashboard/projects");
      } else {
        toast.error("Error deleting project.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Project not found.
      </div>
    );
  }

  // Dynamic status color
  let statusColor = "bg-gray-600";
  if (project.status === "active") statusColor = "bg-blue-600";
  if (project.status === "done") statusColor = "bg-green-600";
  if (project.status === "rest") statusColor = "bg-yellow-600";

  return (
    <div className="min-h-screen w-full bg-black text-gray-100">
      {/* Hero Section with Back & Actions */}
      <div className="w-full h-72 pt-14 bg-gradient-to-b from-gray-800 to-black ">
        <div className=" mx-auto px-6 ">
          <div className="max-w-5xl mx-auto flex justify-between items-center ">
            <div className="justify-start">
              {/* Back Button */}
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            </div>

            {/* Show Edit/Delete only for the owner */}
            {sessionStatus === "loading" ? (
              <p className="text-gray-400">Checking user...</p>
            ) : sessionStatus === "authenticated" ? (
              isOwner ? (
                <div className="flex gap-3">
                  {/* Edit Button */}
                  <button
                    onClick={handleEdit}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    <Trash2 className="w-5 h-5 md:flex hidden" />
                    Delete 
                  </button>
                </div>
              ) : (
                <p className="text-gray-400">Viewing as Guest</p>
              )
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Login To Create Project
              </Link>
            )}
          </div>
        </div>

        {/* Project Title */}
        <div className="max-w-5xl mx-auto px-6 mt-6">
          <h1 className="text-4xl capitalize font-bold">{project.name}</h1>
          <div className="mt-2 flex items-center gap-4 text-sm">
            {project.timeline && (
              <p className="text-gray-300">Timeline: {project.timeline}</p>
            )}
            <span
              className={`inline-block text-xs px-2 py-1 rounded-full ${statusColor}`}
            >
              {project.status.toUpperCase()}
            </span>
          </div>

          {/* GitHub / Live Site links */}
          <div className="mt-4 flex items-center gap-6 text-sm">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                🔗 GitHub Repo
              </a>
            )}
            {project.liveSite && (
              <a
                href={project.liveSite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:underline"
              >
                🌍 Live Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Project Details Section */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="leading-relaxed text-gray-200 whitespace-pre-wrap bg-gray-900 p-6 rounded-lg shadow-md">
          {project.overview}
        </p>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
        🚀 Designed & Developed by Ganesh & Yash. Built with Next.js & Tailwind.
        Hosted on Vercel.
      </footer>
    </div>
  );
}
