"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import NavDashboard from "@/components/NavDashboard"; // Dashboard Navbar
import ProjectCard from "@/components/ProjectCard"; // Updated Project Card Component

type Project = {
  _id: string;
  name: string;
  overview: string;
  status: string;
  timeline: string;
  user: string;
  createdAt: string;
};

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [projGithubLink, setProjGithubLink] = useState("");
  const [projLiveLink, setProjLiveLink] = useState("");
  const [projName, setProjName] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projTimeline, setProjTimeline] = useState("");
  const [projStatus, setProjStatus] = useState("active");

  useEffect(() => {
    fetchRecentProjects();
    fetchProjects();
  }, []);
  async function fetchRecentProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddProject(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projName,
          overview: projDesc,
          timeline: projTimeline,
          status: projStatus,
          githubLink: projGithubLink, // NEW
          liveSite: projLiveLink,
        }),
      });
      if (res.ok) {
        toast.success("Project created successfully!");
        // Refresh recent projects\
        // Reset fields & close modal
        fetchRecentProjects();
        setProjName("");
        setProjDesc("");
        setProjTimeline("");
        setProjStatus("active");
        setShowModal(false);
      } else {
        toast.error("Error creating project");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  }

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects/all");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching projects.");
    }
  }

  async function handleDelete(projectId: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Project deleted successfully!");
        setProjects(projects.filter((project) => project._id !== projectId));
      } else {
        toast.error("Error deleting project.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  }

  if (status === "loading")
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        You must be logged in to view the project{" "}
        <span className="ml-1 text-blue-500 underline">
          <Link href={"/login"}> Login</Link>
        </span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-screen bg-black text-gray-100">
      {/* Navbar */}
      <NavDashboard />

      {/* Main Content */}
      <div className="w-full md:max-w-7xl mx-auto px-6 py-8">
        {/* Header: Title + Add Project Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold">All Projects</h1>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Add Project
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onDelete={handleDelete}
                isOwner={
                  (session?.user as { _id: string })._id === project.user
                }
              />
            ))
          ) : (
            <p className="text-gray-400">No projects found.</p>
          )}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
          <div className="bg-[#1F2129] w-full max-w-lg rounded shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Add New Project
            </h3>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Project Name
                </label>
                <input
                  className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded px-3 py-2 
                       focus:outline-none focus:border-blue-500"
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  overview
                </label>
                <textarea
                  className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded px-3 py-2 
                       focus:outline-none focus:border-blue-500"
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Timeline
                </label>
                <input
                  className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded px-3 py-2 
                       focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Q1 2024"
                  value={projTimeline}
                  onChange={(e) => setProjTimeline(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Status
                </label>
                <select
                  className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded px-3 py-2 
                       focus:outline-none focus:border-blue-500"
                  value={projStatus}
                  onChange={(e) => setProjStatus(e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="done">Done</option>
                  <option value="rest">Rest</option>
                </select>
              </div>

              {/* NEW FIELDS for the updated Project schema */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  GitHub Link
                </label>
                <input
                  className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded px-3 py-2 
                       focus:outline-none focus:border-blue-500"
                  placeholder="https://github.com/your-repo"
                  value={projGithubLink}
                  onChange={(e) => setProjGithubLink(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Live Site URL
                </label>
                <input
                  className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded px-3 py-2 
                       focus:outline-none focus:border-blue-500"
                  placeholder="https://www.myproject.com"
                  value={projLiveLink}
                  onChange={(e) => setProjLiveLink(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
