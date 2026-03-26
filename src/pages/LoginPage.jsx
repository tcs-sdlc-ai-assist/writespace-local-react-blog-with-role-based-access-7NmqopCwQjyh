import React, { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { login } from '../utils/authService.js'
import { isAuthenticated, getRole } from '../utils/sessionManager.js'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

export default function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated()) {
    const role = getRole()
    if (role === 'admin') {
      return <Navigate to="/admin" replace />
    }
    return <Navigate to="/blogs" replace />
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = login(username, password)

    if (!result.success) {
      setError(result.error)
      setLoading(false)
      return
    }

    setLoading(false)

    if (result.user.role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/blogs')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 text-sm">
                Sign in to your WriteSpace account
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-3 mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}