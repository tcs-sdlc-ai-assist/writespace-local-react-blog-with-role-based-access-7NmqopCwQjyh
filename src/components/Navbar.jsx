import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { isAuthenticated, getRole, getCurrentUser, clearSession } from '../utils/sessionManager.js'
import { getAvatar } from './Avatar.jsx'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const authenticated = isAuthenticated()
  const role = getRole()
  const currentUser = getCurrentUser()

  function handleLogout() {
    clearSession()
    setDropdownOpen(false)
    setMobileMenuOpen(false)
    navigate('/')
  }

  function isActive(path) {
    return location.pathname === path
  }

  function getLinkClasses(path) {
    return isActive(path)
      ? 'text-white bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium'
      : 'text-indigo-100 hover:text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium'
  }

  function getMobileLinkClasses(path) {
    return isActive(path)
      ? 'block text-white bg-indigo-700 px-3 py-2 rounded-md text-base font-medium'
      : 'block text-indigo-100 hover:text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-base font-medium'
  }

  function getNavLinks() {
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
    <nav className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={authenticated ? '/blogs' : '/'} className="text-white text-xl font-bold tracking-wide">
              WriteSpace
            </Link>

            {authenticated && (
              <div className="hidden md:flex ml-8 space-x-2">
                {getNavLinks().map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={getLinkClasses(link.path)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center">
            {!authenticated ? (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="text-indigo-100 hover:text-white hover:bg-indigo-500 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium focus:outline-none"
                >
                  {getAvatar(role)}
                  <span>{currentUser?.displayName}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {authenticated && (
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-indigo-100 hover:text-white focus:outline-none p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          )}

          {!authenticated && (
            <div className="md:hidden flex space-x-2">
              <Link
                to="/login"
                className="text-indigo-100 hover:text-white text-sm font-medium px-3 py-2"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-indigo-600 text-sm font-medium px-3 py-2 rounded-md"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {authenticated && mobileMenuOpen && (
        <div className="md:hidden bg-indigo-700 px-4 pb-4 pt-2 space-y-1">
          {getNavLinks().map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={getMobileLinkClasses(link.path)}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-indigo-500 mt-2 pt-2">
            <div className="flex items-center space-x-2 px-3 py-2">
              {getAvatar(role)}
              <span className="text-white text-sm font-medium">{currentUser?.displayName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="block w-full text-left text-indigo-100 hover:text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-base font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}