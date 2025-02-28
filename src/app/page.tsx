"use client"; // needed in Next.js 13 for client components (if you're using any stateful hooks)

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-white text-gray-900">
      {/* NAVBAR */}
      <Navbar/>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        {/* Fancy gradient background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-400 opacity-20 pointer-events-none"></div>
        
        <div className="mx-auto max-w-7xl px-6 py-20 relative flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
            Store & Manage Your Projects<br className="hidden md:block" /> 
            with Ease
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-gray-700 mb-10">
            A modern platform to upload, organize, and collaborate on projects 
            with teammates or clients—no hassle, just results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/login"
              className="bg-indigo-600 text-white rounded-md px-6 py-3 font-medium hover:bg-indigo-700 transition"
            >
              Get Started
            </Link>
            <Link
              href="#about"
              className="border border-indigo-600 text-indigo-600 bg-white rounded-md px-6 py-3 font-medium hover:text-white hover:bg-indigo-600 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* About Text */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Project Store</h2>
            <p className="text-gray-600 mb-4">
              Project Store is designed for freelancers, agencies, and teams who need 
              a simple yet powerful tool to manage all their projects in one place. 
              Our intuitive interface and robust features let you focus on what truly 
              matters—delivering high-quality work on time.
            </p>
            <p className="text-gray-600">
              From Kanban boards to real-time collaboration, version control, and 
              more, Project Store ensures your workflow remains productive and agile. 
              No more juggling dozens of apps—keep everything under one roof.
            </p>
          </div>
          {/* About Image / Illustration (placeholder) */}
          <div className="flex-1">
            <div className="w-full h-64 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-md shadow-lg flex items-center justify-center text-white text-2xl">
              {/* Replace with <Image /> or your own illustration */}
              About Image
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE PROVIDE / SERVICES SECTION */}
      <section id="services" className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">What We Provide</h2>
            <p className="text-gray-600 mt-2 max-w-xl mx-auto">
              Explore our core services built to help you succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <div className="bg-white border border-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600">
                  {/* Icon placeholder */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M12 8c1.657 0 3-.895 3-2V4m0 4c-1.657 0-3-.895-3-2V4m-9 8h18m-2 4H5m14 0a2 2 0 11-4 0m4 0a2 2 0 00-4 0" 
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Centralized Project Storage</h3>
              <p className="text-gray-600">
                Upload all your project files in one secure place, making collaboration
                and version control a breeze.
              </p>
            </div>

            {/* Service Card 2 */}
            <div className="bg-white border border-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 text-pink-600">
                  {/* Icon placeholder */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      d="M16 12A4 4 0 018 12M12 4v.01M12 20v.01M4.93 4.93l.01.01M19.07 19.07l.01.01M19.07 4.93l.01.01M4.93 19.07l.01.01" 
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Collaboration</h3>
              <p className="text-gray-600">
                Invite team members, comment on tasks, and track changes instantly 
                to keep everyone on the same page.
              </p>
            </div>

            {/* Service Card 3 */}
            <div className="bg-white border border-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600">
                  {/* Icon placeholder */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      d="M9.75 17L15 12m0 0L9.75 7m5.25 5H3" 
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Task Management</h3>
              <p className="text-gray-600">
                Organize tasks, set deadlines, and prioritize them seamlessly with 
                our integrated Kanban board and reminders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT / CTA SECTION */}
      <section
        id="contact"
        className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
      >
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-white/90 max-w-lg mx-auto">
            Experience the future of project management. Contact us or sign up now 
            and supercharge your productivity.
          </p>
          <div className="space-x-4">
            <Link
              href="/register"
              className="inline-block bg-white text-indigo-600 rounded-md px-6 py-3 font-semibold hover:bg-indigo-50 transition"
            >
              Create an Account
            </Link>
            <Link
              href="/about"
              className="inline-block border border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-indigo-600 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer/>
    </main>
  );
}
