import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllUsers, createUser, deleteUser, canDeleteUser } from '../utils/userManager.js'
import { getAvatar } from '../components/Avatar.jsx'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'

export default function UserManagement() {
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('viewer')
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState(null)

  const users = getAllUsers()

  function handleCreateUser(e) {
    e.preventDefault()
    setFormError('')
    setLoading(true)

    const result = createUser(displayName, username, password, role)

    if (!result.success) {
      setFormError(result.error)
      setLoading(false)
      return
    }

    setDisplayName('')
    setUsername('')
    setPassword('')
    setRole('viewer')
    setLoading(false)
    navigate('/users')
  }

  function handleDelete(userId) {
    setDeletingUserId(userId)
    setConfirmOpen(true)
  }

  function handleConfirmDelete() {
    setConfirmOpen(false)
    setError('')

    const result = deleteUser(deletingUserId)

    if (!result.success) {
      setError(result.error)
      setDeletingUserId(null)
      return
    }

    setDeletingUserId(null)
    navigate('/users')
  }

  function handleCancelDelete() {
    setConfirmOpen(false)
    setDeletingUserId(null)
  }

  function getRoleBadgeClasses(userRole) {
    if (userRole === 'admin') {
      return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800'
    }
    return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800'
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 text-sm mt-1">
              Create and manage users on WriteSpace
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Create User Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Create New User
            </h2>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-3 mb-6 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter display name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>

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
                    placeholder="Choose a username"
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
                    placeholder="Create a password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2 rounded-md text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>

          {/* User List */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              All Users ({users.length})
            </h2>

            {users.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {users.map((user) => {
                        const showDelete = canDeleteUser(user)

                        return (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                {getAvatar(user.role)}
                                <span className="text-sm font-medium text-gray-900">
                                  {user.displayName}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-600">
                                {user.username}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={getRoleBadgeClasses(user.role)}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              {showDelete ? (
                                <button
                                  onClick={() => handleDelete(user.id)}
                                  className="text-gray-400 hover:text-red-600 transition-colors duration-150 focus:outline-none"
                                  title="Delete user"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              ) : (
                                <button
                                  disabled
                                  className="text-gray-200 cursor-not-allowed"
                                  title={
                                    user.username === 'admin'
                                      ? 'Cannot delete the default admin account'
                                      : 'Cannot delete your own account'
                                  }
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {users.map((user) => {
                    const showDelete = canDeleteUser(user)

                    return (
                      <div
                        key={user.id}
                        className="bg-white rounded-lg shadow-md p-5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getAvatar(user.role)}
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {user.displayName}
                              </p>
                              <p className="text-xs text-gray-500">
                                @{user.username}
                              </p>
                            </div>
                          </div>
                          <span className={getRoleBadgeClasses(user.role)}>
                            {user.role}
                          </span>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                          {showDelete ? (
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors duration-150 focus:outline-none"
                              title="Delete user"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          ) : (
                            <button
                              disabled
                              className="text-gray-200 cursor-not-allowed"
                              title={
                                user.username === 'admin'
                                  ? 'Cannot delete the default admin account'
                                  : 'Cannot delete your own account'
                              }
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-md">
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-3xl mb-4">
                  👥
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No users yet
                </h3>
                <p className="text-gray-600 text-sm">
                  Create your first user using the form above.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <ConfirmDialog
        isOpen={confirmOpen}
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  )
}