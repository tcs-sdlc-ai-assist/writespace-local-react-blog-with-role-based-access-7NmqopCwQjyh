import React from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated, getRole } from '../utils/sessionManager.js'

export default function Footer() {
  const authenticated = isAuthenticated()
  const role = getRole()

  function getFooterLinks() {
    if (!authenticated) {
      return [
        { path: '/', label: 'Home' },
        { path: '/login', label: 'Login' },
        { path: '/register', label: 'Register' },
      ]
    }

    const links = [
      { path: '/blogs', label: 'All Blogs' },
      { path: '/blogs/new', label: 'Write' },
    ]

    if (role === 'admin') {
      links.push({ path: '/users', label: 'Users' })
    }

    return links
  }

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-white text-lg font-bold tracking-wide">
            WriteSpace
          </div>

          <div className="flex space-x-4">
            {getFooterLinks().map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-300 hover:text-white text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} WriteSpace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}