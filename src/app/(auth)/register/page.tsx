"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Redirect logged-in users away from register page
  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.push("/dashboard");
    }
  }, [sessionStatus]); // ✅ Trigger redirect only when session status changes

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    const loadingToastId = toast.loading("Registering...");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      toast.dismiss(loadingToastId);

      if (res.ok) {
        toast.success("Registration successful!", { duration: 3000 });
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        toast.error(data.error || "Error registering user", { duration: 3000 });
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error("Something went wrong. Check console/logs.", { duration: 3000 });
      console.error(error);
    }
  }

  // ✅ Show loading while session is checking status
  if (sessionStatus === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-black">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 bg-gradient-to-br from-blue-50 to-white relative">
        {/* Decorative top-right circle */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10" />
        {/* Decorative bottom-left circle */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10" />

        <div className="mx-auto max-w-7xl px-6 py-12 md:py-20 flex flex-col md:flex-row items-center justify-center md:justify-between">
          {/* Left Column - Some Headline or Info */}
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Create Your Account
            </h2>
            <p className="text-gray-600 mb-6">
              Sign up to manage your projects efficiently.
              Stay organized, collaborate with teams, and deliver on time.
            </p>
            {/* Additional CTA or bullet points */}
            <ul className="list-disc list-inside text-gray-500 space-y-2">
              <li>Organize your tasks</li>
              <li>Invite teammates easily</li>
              <li>Track progress in real-time</li>
            </ul>
          </div>

          {/* Right Column - Registration Form */}
          <div className="md:w-1/2 max-w-md w-full">
            <div className="bg-white shadow-md rounded-md p-6">
              <h1 className="text-2xl font-semibold mb-6">Register</h1>
              <form onSubmit={handleRegister}>
                <input
                  className="border p-2 mb-4 w-full rounded"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  className="border p-2 mb-4 w-full rounded"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  className="border p-2 mb-6 w-full rounded"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button className="bg-blue-500 text-white px-4 py-2 w-full rounded hover:bg-blue-600 transition">
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
