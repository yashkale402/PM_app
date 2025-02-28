"use client";

import { useEffect, useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react"; // Import back arrow icon

type Project = {
  _id: string;
  name: string;
  overview: string;
  status: string;
  timeline: string;
  githubLink?: string;
  liveSite?: string;
};

export default function EditProjectPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const { projectId } = useParams() as { projectId: string };

  const [showModal, setShowModal] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [overview, setOverview] = useState("");
  const [status, setStatus] = useState("active");
  const [timeline, setTimeline] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [liveSite, setLiveSite] = useState("");

  useEffect(() => {
    if (session) fetchProject();
  }, [session]);

  async function fetchProject() {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Project not found");
        return router.push("/dashboard");
      }

      if (data.project.user !== session?.user?._id) {
        toast.error("Unauthorized to edit this project.");
        return router.push("/dashboard");
      }

      setProject(data.project);
      setName(data.project.name);
      setOverview(data.project.overview);
      setStatus(data.project.status);
      setTimeline(data.project.timeline);
      setGithubLink(data.project.githubLink || "");
      setLiveSite(data.project.liveSite || "");
    } catch (error) {
      console.error(error);
      toast.error("Error loading project.");
    }
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, overview, status, timeline, githubLink, liveSite }),
      });

      if (res.ok) {
        toast.success("Project updated successfully!");
        router.push(`/project/${projectId}`);
      } else {
        toast.error("Error updating project.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  }

  function handleBack() {
    router.back();
  }

  if (sessionStatus === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Loading...
      </div>
    );
  }
  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Not authorized.
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

  return (
    <div className="min-h-screen w-full bg-black text-gray-100">
      {/* Hero Section with Back & Edit Buttons */}
      <div className="w-full h-72 pt-14 bg-gradient-to-b from-gray-800 to-black ">
        <div className="mx-auto px-6">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>
        </div>

        {/* Project Title */}
        <div className="max-w-5xl mx-auto px-6 mt-6">
          <h1 className="text-4xl font-bold">{project.name}</h1>
          <div className="mt-2 flex items-center gap-4 text-sm">
            {project.timeline && <p className="text-gray-300">Timeline: {project.timeline}</p>}
            <span className={`inline-block text-xs px-2 py-1 rounded-full ${status === "active" ? "bg-blue-600" : status === "done" ? "bg-green-600" : "bg-yellow-600"}`}>
              {status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
          <div className="bg-[#1F2129] w-full max-w-lg rounded shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">Edit Project</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Project Name</label>
                <input
                  className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Overview</label>
                <textarea
                  className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Timeline</label>
                <input
                  className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Q1 2024"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Status</label>
                <select
                  className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="done">Done</option>
                  <option value="rest">Rest</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">GitHub Link</label>
                <input
                  className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="https://github.com/your-repo"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Live Site URL</label>
                <input
                  className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="https://www.myproject.com"
                  value={liveSite}
                  onChange={(e) => setLiveSite(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button onClick={() => {setShowModal(false); router.push(`/project/${projectId}`)}} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Update Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
