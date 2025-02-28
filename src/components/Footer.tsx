import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
  {/* Top Footer Section */}
  <div className="mx-auto max-w-7xl px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Column 1: Brand/About */}
    <div>
      <h2 className="text-xl font-bold text-gray-800">PM App</h2>
      <p className="text-gray-600 mt-2 max-w-xs">
        A modern project management platform for teams and freelancers. Stay organized, 
        collaborate seamlessly, and deliver on time.
      </p>
      {/* Social icons (optional) */}
      <div className="flex space-x-4 mt-4">
        <a
          href="#"
          className="text-gray-500 hover:text-gray-700 transition"
          aria-label="Facebook"
        >
          {/* Facebook icon example */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="h-5 w-5"
            viewBox="0 0 24 24"
          >
            <path d="M22.54 0H1.46C.66 0 0 .66 0 1.46v21.08c0 .8.66 1.46 1.46 1.46h11.33v-9.17H9.69v-3.58h3.1V8.35c0-3.07 1.88-4.74 4.62-4.74 1.31 0 2.44.1 2.77.14v3.2h-1.9c-1.49 0-1.78.71-1.78 1.75v2.29h3.56l-.46 3.58h-3.1V24h6.07c.8 0 1.46-.66 1.46-1.46V1.46C24 .66 23.34 0 22.54 0z" />
          </svg>
        </a>
        <a
          href="#"
          className="text-gray-500 hover:text-gray-700 transition"
          aria-label="Twitter"
        >
          {/* Twitter icon example */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="h-5 w-5"
            viewBox="0 0 24 24"
          >
            <path d="M19.46 7.95c.01.11.01.22.01.33 0 3.34-2.54 7.2-7.2 7.2-1.43 0-2.76-.42-3.88-1.14h.55c1.18 0 2.28-.4 3.15-1.07-1.1-.02-2.03-.74-2.35-1.73.15.03.31.05.47.05.23 0 .45-.03.65-.09-1.16-.23-2.03-1.25-2.03-2.47 0-.01 0-.02 0-.02.34.19.74.31 1.16.32-.69-.46-1.14-1.25-1.14-2.14 0-.47.13-.91.36-1.29 1.3 1.59 3.24 2.64 5.43 2.75-.04-.19-.06-.38-.06-.58 0-1.4 1.13-2.54 2.54-2.54.73 0 1.38.31 1.84.8.58-.11 1.12-.32 1.61-.61-.19.6-.59 1.11-1.12 1.43.52-.06 1.03-.2 1.5-.41-.34.51-.77.97-1.27 1.33z" />
          </svg>
        </a>
        {/* Add more icons as needed */}
      </div>
    </div>

    {/* Column 2: Navigation Links */}
    <div>
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
        Navigation
      </h3>
      <ul className="mt-4 space-y-2">
        <li>
          <a href="/" className="text-gray-600 hover:text-blue-600 transition">
            Home
          </a>
        </li>
        <li>
          <a
            href="#features"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Features
          </a>
        </li>
        <li>
          <a
            href="#pricing"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Pricing
          </a>
        </li>
        <li>
          <a
            href="#contact"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Contact
          </a>
        </li>
      </ul>
    </div>

    {/* Column 3: Contact / Info */}
    <div>
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
        Get in Touch
      </h3>
      <ul className="mt-4 space-y-2 text-gray-600">
        <li>Phone: +91 9209197082</li>
        <li>Email: yash@pm.com</li>
        <li>Address: Dr D Y Patil ACS College Campus</li>
      </ul>

      {/* Optional: Newsletter signup example */}
      <div className="mt-6">
        <p className="text-sm font-semibold text-gray-700 mb-2">Newsletter</p>
        <form className="flex items-center">
          <input
            type="email"
            required
            placeholder="Your email"
            className="border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  </div>

  {/* Bottom Footer Section */}
  <div className="border-t border-gray-200 py-4">
    <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between">
      <p className="text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} PM App. All rights reserved.
      </p>
      <div className="mt-2 md:mt-0 space-x-4 text-sm text-gray-500">
        <a href="#" className="hover:text-gray-700 transition">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-gray-700 transition">
          Terms of Service
        </a>
      </div>
    </div>
  </div>
</footer>

  )
}

export default Footer
