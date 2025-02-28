"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function NavDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter(); // Initialize useRouter();
  const appHost =process.env.APP_HOST_LINK
  function handleLogout() {
    signOut({ callbackUrl:  appHost }).then(() => {
      router.push("/login"); // Redirect to home after logout
    });
  }

  return (
    <header className="bg-black backdrop-blur-md text-gray-100 border-b border-gray-700">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        {/* Left: Logo */}
        <div className="flex lg:flex-1">
          <Link href="/dashboard" className="text-lg font-bold text-white">
            Project Manager
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:bg-gray-700 rounded-md p-2"
          >
            {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>

        {/* Navigation Links for Desktop */}
        <div className="hidden lg:flex lg:gap-x-10">
          <Link href="/dashboard" className="text-sm font-semibold text-gray-300 hover:text-white">
            Dashboard
          </Link>
          <Link href="/dashboard/projects" className="text-sm font-semibold text-gray-300 hover:text-white">
            Projects
          </Link>
          <Link href="/dashboard/todos" className="text-sm font-semibold text-gray-300 hover:text-white">
            Todos
          </Link>
          <Link href="/dashboard/timeline" className="text-sm font-semibold text-gray-300 hover:text-white">
            Timeline
          </Link>
        </div>

        {/* Logout Button */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1A1C23] text-gray-100 border-t border-gray-700">
          <div className="flex flex-col p-4 space-y-4">
            <Link href="/dashboard" className="text-sm font-semibold text-gray-300 hover:text-white">
              Dashboard
            </Link>
            <Link href="/dashboard/projects" className="text-sm font-semibold text-gray-300 hover:text-white">
              Projects
            </Link>
            <Link href="/dashboard/todos" className="text-sm font-semibold text-gray-300 hover:text-white">
              Todos
            </Link>
            <Link href="/dashboard/timeline" className="text-sm font-semibold text-gray-300 hover:text-white">
              Timeline
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
