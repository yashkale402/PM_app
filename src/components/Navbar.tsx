"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow z-10 relative">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="text-xl font-bold text-gray-800">
          PM App
        </Link>

        {/* Desktop Nav (hidden on mobile) */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <Link href="/#features" className="hover:text-blue-600 transition">
            Features
          </Link>
          <Link href="/#about" className="hover:text-blue-600 transition">
            About
          </Link>
          <Link href="/login" className="hover:text-blue-600 transition">
            Login
          </Link>
        </div>

        {/* Mobile Menu Button (visible on small screens only) */}
        <button
          className="text-gray-600 md:hidden hover:text-blue-600 transition"
          onClick={toggleMenu}
        >
          {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu (collapsible) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-sm">
          <div className="px-4 py-3 flex flex-col space-y-2">
            <Link
              href="/"
              className="hover:text-blue-600 transition"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              href="/#features"
              className="hover:text-blue-600 transition"
              onClick={toggleMenu}
            >
              Features
            </Link>
            <Link
              href="/#about"
              className="hover:text-blue-600 transition"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              href="/login"
              className="hover:text-blue-600 transition"
              onClick={toggleMenu}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
