"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ProjectCard from "@/components/ProjectCard";
import NavDashboard from "@/components/NavDashboard";

type Project = {
  _id: string;
  name: string;
  overview: string;
  status: string;
  timeline: string;
  createdAt: string;
};

type Todo = {
  _id: string;
  task: string;
  completed: boolean;
  priority: string;
  note: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [projGithubLink, setProjGithubLink] = useState("");
  const [projLiveLink, setProjLiveLink] = useState("");

  // Project form fields for the modal
  const [projName, setProjName] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projTimeline, setProjTimeline] = useState("");
  const [projStatus, setProjStatus] = useState("active");

  useEffect(() => {
    if (session) {
      fetchRecentProjects();
      fetchRecentTodos();
    }
  }, [session]);

  async function fetchRecentProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchRecentTodos() {
    if (!session?.user) return; // ✅ Ensure session is available before fetching

    try {
      const res = await fetch(`/api/todos`);
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch todos");
      }

      setTodos(data.todos || []);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching todos.");
    }
  }

  async function handleDeleteProject(projectId: string) {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Project deleted successfully!");
        // Refresh recent projects
        fetchRecentProjects();
      } else {
        toast.error("Error deleting project.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  }

  // Handle "Add Project" form submission
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
        // Refresh recent projects
        fetchRecentProjects();
        // Reset fields & close modal
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

  // Basic authentication checks
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }
  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        You must be logged in to view the dashboard.
      </div>
    );
  }

  return (
    <div className=" min-h-screen bg-black text-gray-100">
      <NavDashboard />

      <div className="\">
        <div className="flex-1 flex flex-col max-w-7xl mx-auto ">
          {/* TOP NAV */}

          <main className="flex-1 p-6 space-y-8 overflow-y-auto">
            {/* Dashboard Header + "Add Project" Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-bold">
                Welcome to Your Dashboard ,{session.user?.name}
              </h2>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  + Add Project
                </button>
              </div>
            </div>

            {/* Projects Overview */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Recent Projects</h3>
                <Link href="/dashboard/projects">
                  <span className="cursor-pointer text-blue-400 hover:underline">
                    View All Projects
                  </span>
                </Link>
              </div>
              {projects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((p) => (
                    <ProjectCard
                      key={p._id}
                      project={p}
                      isOwner={true}
                      onDelete={() => handleDeleteProject(p._id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No recent projects.</p>
              )}
            </section>

            {/* Todos Overview */}
            {/* <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Recent Todos</h3>
                <Link href="/dashboard/todos">
                  <span className="cursor-pointer text-blue-400 hover:underline">
                    View All Todos
                  </span>
                </Link>
              </div>
              {todos.length > 0 ? (
                <ul className="bg-[#1F2129] rounded-md shadow p-4">
                  {todos
                    .filter((todo) => todo.priority === "high") // Only high-priority tasks
                    .map((todo) => (
                      <li
                        key={todo._id}
                        className={`border-b capitalize border-gray-700 last:border-b-0 py-2 text-sm ${
                          todo.completed
                            ? "line-through text-gray-500"
                            : "text-gray-200"
                        }`}
                      >
                        <div>
                          {todo.task} -{" "}
                          <span className="text-red-500 font-bold">
                            {todo.priority}
                          </span>
                        </div>
                      </li>
                    ))}


                    
                </ul>
              ) : (
                <p className="text-gray-400">No recent todos.</p>
              )}

              {/* {todos.length > 0 ? (
                <ul className="bg-[#1F2129] rounded-md shadow p-4">
                  {(() => {
                    const highPriorityTodos = todos.filter(
                      (todo) => todo.priority === "high"
                    );
                    const mediumPriorityTodos = todos.filter(
                      (todo) => todo.priority === "medium"
                    );
                    const lowPriorityTodos = todos.filter(
                      (todo) => todo.priority === "low"
                    );

                    // Determine which priority level to display based on availability
                    const prioritizedTodos =
                      highPriorityTodos.length > 0
                        ? highPriorityTodos
                        : mediumPriorityTodos.length > 0
                        ? mediumPriorityTodos
                        : lowPriorityTodos;

                    return prioritizedTodos.map((todo) => (
                      <li
                        key={todo._id}
                        className={`border-b capitalize border-gray-700 last:border-b-0 py-2 text-sm ${
                          todo.completed
                            ? "line-through text-gray-500"
                            : "text-gray-200"
                        }`}
                      >
                        <div className="flex justify-between capitalize">
                          <div>
                          {todo.task} {" "}
                          <div className="text-gray-500 text-sm">Note : {todo.note}</div>
                          </div>
                          <span
                            className={`font-bold ${
                              todo.priority === "high"
                                ? "text-red-500"
                                : todo.priority === "medium"
                                ? "text-yellow-500"
                                : "text-green-500"
                            }`}
                          >
                            {todo.priority}
                          </span>

                        </div>
                      </li>
                    ));
                  })()}
                </ul>
              ) : (
                <p className="text-gray-400">No recent todos.</p>
              )} */}
            {/* </section> */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Your Recent Todos</h3>
                <Link href="/dashboard/todos">
                  <span className="cursor-pointer text-blue-400 hover:underline">
                    View All Todos
                  </span>
                </Link>
              </div>

              {todos.length > 0 ? (
  <ul className="bg-[#1F2129] rounded-md shadow p-4">
    {todos.slice(0, 5).map((todo) => ( // 👈 Limit to 5 todos using slice(0, 5)
      <li
        key={todo._id}
        className={`border-b capitalize border-gray-700 last:border-b-0 py-2 text-sm ${
          todo.completed
            ? "line-through text-gray-500"
            : "text-gray-200"
        }`}
      >
        <div className="flex justify-between capitalize">
          <div>
            {todo.task}{" "}
            <div className="text-gray-500 text-sm">
              Note: {todo.note}
            </div>
          </div>
          <span
            className={`font-bold ${
              todo.priority === "high"
                ? "text-red-500"
                : todo.priority === "medium"
                ? "text-yellow-500"
                : "text-green-500"
            }`}
          >
            {todo.priority}
          </span>
        </div>
      </li>
    ))}
  </ul>
) : (
  <p className="text-gray-400">No recent todos.</p>
)}

            </section>

            {/* Timeline Snippet */}
            <section className="bg rounded-md shadow p-4">
              <h3 className="text-xl font-semibold mb-4">
                Recent Project Timeline
              </h3>
              {projects.length > 0 ? (
                <ul className="relative border-s border-gray-200 dark:border-gray-700">
                  {projects.map((p) => (
                    <li key={p._id} className="mb-10  ms-6">
                      <div className="absolute   flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900"></div>
                      <div className="pl-6 text-gray-300items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-xs sm:flex dark:bg-gray-700 dark:border-gray-600">
                        <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </time>
                        <div className="text-sm font-normal text-gray-500 dark:text-gray-300">
                          {p.name}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No timeline available yet.</p>
              )}
              <Link href="/dashboard/timeline">
                <span className="cursor-pointer mt-4 inline-block text-blue-400 hover:underline">
                  View Full Timeline
                </span>
              </Link>
            </section>
          </main>
        </div>
      </div>
      {/* MAIN CONTENT AREA */}

      {/* ADD PROJECT MODAL */}
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
