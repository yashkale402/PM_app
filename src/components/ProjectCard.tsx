import React from "react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { IoMdBrowsers } from "react-icons/io";

type Project = {
  _id: string;
  name: string;
  overview: string;
  status: string; // "active", "done", or "rest"
  timeline: string;
  createdAt: string;
  githubLink?: string;
  liveSite?: string; // Owner ID
};

type Props = {
  project: Project;
  onDelete: (projectId: string) => void;
  isOwner: boolean;
};

export default function ProjectCard({ project, onDelete, isOwner }: Props) {
  // Limit overview words for display
  const words = project.overview?.split(" ") || [];
  const wordLimit = 2;
  const truncatedDesc =
    words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "…"
      : project.overview;

  // Dynamic status badge color
  const statusColors = {
    active: "bg-blue-600",
    done: "bg-green-600",
    rest: "bg-yellow-600",
  };
  // const statusColor = statusColors[project.status] || "bg-gray-600";
  const statusColor = statusColors[project.status as keyof typeof statusColors] || "bg-gray-600";

  return (
    <div className="bg-[#1b233d] w-full text-white rounded-2xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-500 ease-out">
      {/* TOP SECTION (Gradient & Icons) */}
      <div className="relative h-[150px] bg-gradient-to-r from-cyan-500 to-[#50f6ff] flex items-center px-4 justify-between">
        {/* Project Name */}
        <h4 className="font-bold text-lg">{project.name}</h4>

        {/* GitHub & Live Site Links */}
        <div className="flex space-x-3">
          {project.githubLink && (
            <Link
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-white transition"
              title="GitHub Repository"
            >
              <FaGithub className="w-5 h-5" />
            </Link>
          )}

          {project.liveSite && (
            <Link
              href={project.liveSite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-white transition"
              title="Live Website"
            >
              <IoMdBrowsers className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>

      {/* BOTTOM SECTION (Project Details) */}
      <div className="p-4">
        {/* Status Badge */}
        <div className="mb-2">
          <span
            className={`text-xs text-white px-2 py-1 rounded-full ${statusColor}`}
          >
            {project.status.toUpperCase()}
          </span>
        </div>

        {/* Overview with Read More */}
        <p className="text-sm text-gray-300 mb-2 leading-5">
          {truncatedDesc}{" "}
          {words.length > wordLimit && (
            <Link href={`/project/${project._id}`}>
              <span className="text-blue-400 hover:underline ml-1 cursor-pointer">
                Read More
              </span>
            </Link>
          )}
        </p>

        <p className="text-xs text-gray-400 mb-2">
          Created on {new Date(project.createdAt).toLocaleDateString()}
        </p>
        {project.timeline && (
          <p className="text-xs text-gray-500 mb-3">
            Timeline: {project.timeline}
          </p>
        )}

        {/* Buttons */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-4">
            <Link href={`/project/${project._id}`}>
              <button className="bg-blue-600 text-white text-xs px-5 py-2 rounded hover:bg-blue-700 transition">
                View
              </button>
            </Link>
            <Link href={`/project/${project._id}/edit`}>
              <button className="bg-gray-600 text-white text-xs px-5 py-2 rounded hover:bg-gray-700 transition">
                Edit
              </button>
            </Link>
          </div>
          {isOwner && (
            <button
              className="bg-red-600 text-white text-xs px-5 py-2 rounded hover:bg-red-700 transition"
              onClick={() => onDelete(project._id)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
