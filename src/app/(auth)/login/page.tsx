"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Redirect logged-in users away from login/register page
  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.push("/dashboard");
    }
  }, [sessionStatus]); // ✅ Trigger redirect only when session status changes

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    // Show loading toast
    const loadingToastId = toast.loading("Logging in...");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      toast.dismiss(loadingToastId);

      if (res?.ok) {
        toast.success("Login successful!", { duration: 3000 });
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        toast.error("Invalid credentials", { duration: 3000 });
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error("Something went wrong", { duration: 3000 });
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-white relative">
      {/* Decorative top-left circle */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10" />
      {/* Decorative bottom-right circle */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10" />

      {/* Main Content */}
      <Navbar />
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 mb-4 text-center text-2xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form onSubmit={handleLogin}>
            <input
              className="border p-2 mb-4 w-full rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="border p-2 mb-6 w-full rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 transition"
            >
              Login
            </button>

            <p className="mt-5 text-center text-sm text-gray-500">
              Not a member?{" "}
              <Link
                href="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
