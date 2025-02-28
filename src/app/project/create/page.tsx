"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function CreateProjectPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [name, setName] = useState("");
  const [overview, setoverview] = useState("");
  const [statusField, setStatusField] = useState("active"); // rename to avoid conflict with useSession "status"
  const [timeline, setTimeline] = useState("");
  // NEW FIELDS
  const [githubLink, setGithubLink] = useState("");
  const [liveSite, setLiveSite] = useState("");

  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen">Loading session...</div>;
  }
  if (!session) {
    return <div className="flex items-center justify-center h-screen">Not authorized.</div>;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          overview,
          status: statusField,
          timeline,
          githubLink, // pass along
          liveSite,   // pass along
        }),
      });
      if (res.ok) {
        toast.success("Project created successfully!");
        router.push("/dashboard");
      } else {
        toast.error("Error creating project.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="max-w-md w-full bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-6">Create New Project</h1>
        
        <input
          className="border p-2 mb-3 w-full rounded"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          className="border p-2 mb-3 w-full rounded"
          placeholder="Project overview"
          value={overview}
          onChange={(e) => setoverview(e.target.value)}
        />
        
        <label className="block mb-1 text-sm font-medium">Project Status</label>
        <select
          className="border p-2 mb-3 w-full rounded"
          value={statusField}
          onChange={(e) => setStatusField(e.target.value)}
        >
          <option value="active">Active</option>
          <option value="done">Done</option>
          <option value="rest">Rest</option>
        </select>

        <input
          className="border p-2 mb-3 w-full rounded"
          placeholder="Timeline (e.g. Q4 2024)"
          value={timeline}
          onChange={(e) => setTimeline(e.target.value)}
        />

        {/* NEW: GitHub Link */}
        <input
          className="border p-2 mb-3 w-full rounded"
          placeholder="GitHub Repo Link (optional)"
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
        />

        {/* NEW: Live Site Link */}
        <input
          className="border p-2 mb-3 w-full rounded"
          placeholder="Live Website URL (optional)"
          value={liveSite}
          onChange={(e) => setLiveSite(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Create Project
        </button>
      </form>
    </div>
  );
}
