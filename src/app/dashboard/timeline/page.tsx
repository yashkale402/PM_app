"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import NavDashboard from "@/components/NavDashboard";

type Project = {
  _id: string;
  name: string;
  overview: string;
  createdAt: string;
  status: string;
};

export default function TimelinePage() {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (session) {
      fetchAllProjects();
    }
  }, [session]);

  async function fetchAllProjects() {
    try {
      const res = await fetch("/api/projects/all");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
    }
  }

  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen">Loading timeline...</div>;
  }

  if (!session) {
    return <div className="flex items-center justify-center h-screen">Not authorized</div>;
  }

  return (
    <main className="min-h-screen bg-black">
      <NavDashboard />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold text-white mb-8">Project Timeline</h1>

        {projects.length > 0 ? (
          <ul className="relative border-l border-gray-700">
            {projects.map((p) => (
              <li key={p._id} className="mb-10 ms-6">
                {/* Timeline Circle with Profile Image */}
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -start-4 ring-8 ring-black dark:ring-gray-900 dark:bg-blue-900">
                
                </span>

                {/* Timeline Content */}
                <div className="p-4 bg-[#1F2129] border border-gray-600 rounded-lg shadow-xs">
                  {/* Header: Time + Project Title */}
                  <div className="flex justify-between mb-3">
                    <time className="text-xs font-normal text-gray-400">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </time>
                    <div className="text-sm font-semibold text-white">{p.name}</div>
                  </div>

                  {/* Project Overview with "Read More" if > 20 words */}
                  {p.overview && (
                    <div className="p-3 text-xs italic font-normal text-gray-300 border border-gray-600 rounded-lg bg-gray-800">
                      {p.overview.split(" ").length > 20 ? (
                        <>
                          {p.overview.split(" ").slice(0, 20).join(" ")}...
                          <Link
                            href={`/project/${p._id}`}
                            className="text-blue-400 hover:underline ml-1"
                          >
                            Read More
                          </Link>
                        </>
                      ) : (
                        p.overview
                      )}
                    </div>
                  )}

                  {/* Status */}
                  <p className="mt-2 text-xs text-gray-400">Status: {p.status}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No projects to display in timeline.</p>
        )}
      </div>
    </main>
  );
}
