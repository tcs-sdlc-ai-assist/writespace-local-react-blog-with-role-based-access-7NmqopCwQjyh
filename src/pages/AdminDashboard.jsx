import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllBlogs, deleteBlog, canEditBlog, canDeleteBlog } from '../utils/blogManager.js'
import { getAllUsers } from '../utils/userManager.js'
import { getAvatar } from '../components/Avatar.jsx'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import StatCard from '../components/StatCard.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'

function formatDate(dateString) {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (error) {
    return ''
  }
}

function truncateContent(content, maxLength = 100) {
  if (!content) return ''
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength).trimEnd() + '...'
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingBlogId, setDeletingBlogId] = useState(null)
  const [error, setError] = useState('')

  const blogs = getAllBlogs()
  const users = getAllUsers()
  const recentPosts = blogs.slice(0, 5)

  const totalPosts = blogs.length
  const totalUsers = users.length
  const adminsCount = users.filter((u) => u.role === 'admin').length
  const viewersCount = users.filter((u) => u.role === 'viewer').length

  function handleDelete(blogId) {
    setDeletingBlogId(blogId)
    setConfirmOpen(true)
  }

  function handleConfirmDelete() {
    setConfirmOpen(false)
    setError('')

    const result = deleteBlog(deletingBlogId)

    if (!result.success) {
      setError(result.error)
      setDeletingBlogId(null)
      return
    }

    setDeletingBlogId(null)
    navigate('/admin')
  }

  function handleCancelDelete() {
    setConfirmOpen(false)
    setDeletingBlogId(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Gradient Banner */}
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-indigo-100 text-sm">
              Manage your WriteSpace platform — posts, users, and more.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard label="Total Posts" count={totalPosts} icon="📝" />
            <StatCard label="Total Users" count={totalUsers} icon="👥" />
            <StatCard label="Admins" count={adminsCount} icon="👑" />
            <StatCard label="Viewers" count={viewersCount} icon="📖" />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/blogs/new"
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2 rounded-md text-sm font-medium transition-colors duration-150"
              >
                + Write New Post
              </Link>
              <Link
                to="/users"
                className="bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 px-5 py-2 rounded-md text-sm font-medium transition-colors duration-150"
              >
                Manage Users
              </Link>
            </div>
          </div>

          {/* Recent Posts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Posts
              </h2>
              <Link
                to="/blogs"
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                View All →
              </Link>
            </div>

            {recentPosts.length > 0 ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {recentPosts.map((blog) => {
                    const showEdit = canEditBlog(blog)
                    const showDelete = canDeleteBlog(blog)

                    return (
                      <div
                        key={blog.blogId}
                        className="p-5 flex items-start justify-between space-x-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            {getAvatar(blog.authorRole)}
                            <span className="text-sm font-medium text-gray-700">
                              {blog.authorDisplayName}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatDate(blog.createdAt)}
                            </span>
                          </div>
                          <Link
                            to={`/blog/${blog.blogId}`}
                            className="text-base font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-150 line-clamp-1"
                          >
                            {blog.title}
                          </Link>
                          <p className="text-gray-600 text-sm mt-1">
                            {truncateContent(blog.content)}
                          </p>
                        </div>

                        {(showEdit || showDelete) && (
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {showEdit && (
                              <Link
                                to={`/blogs/${blog.blogId}/edit`}
                                className="text-gray-400 hover:text-indigo-600 transition-colors duration-150"
                                title="Edit post"
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
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </Link>
                            )}
                            {showDelete && (
                              <button
                                onClick={() => handleDelete(blog.blogId)}
                                className="text-gray-400 hover:text-red-600 transition-colors duration-150 focus:outline-none"
                                title="Delete post"
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
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-md">
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-3xl mb-4">
                  📝
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Get started by creating the first post on WriteSpace!
                </p>
                <Link
                  to="/blogs/new"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                >
                  Create Your First Post
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <ConfirmDialog
        isOpen={confirmOpen}
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  )
}