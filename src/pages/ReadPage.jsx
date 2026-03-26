import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getBlogById, deleteBlog, canEditBlog, canDeleteBlog } from '../utils/blogManager.js'
import { isAuthenticated } from '../utils/sessionManager.js'
import { getAvatar } from '../components/Avatar.jsx'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
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

export default function ReadPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true })
      return
    }

    if (!id) {
      setNotFound(true)
      return
    }

    const foundBlog = getBlogById(id)

    if (!foundBlog) {
      setNotFound(true)
      return
    }

    setBlog(foundBlog)
  }, [id, navigate])

  function handleDelete() {
    setConfirmOpen(true)
  }

  function handleConfirmDelete() {
    setConfirmOpen(false)
    setError('')

    const result = deleteBlog(blog.blogId)

    if (!result.success) {
      setError(result.error)
      return
    }

    navigate('/blogs')
  }

  function handleCancelDelete() {
    setConfirmOpen(false)
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 bg-gray-50 py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-3xl mb-4">
                🔍
              </span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Post not found
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                The blog post you're looking for doesn't exist or has been removed.
              </p>
              <Link
                to="/blogs"
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2 rounded-md text-sm font-medium transition-colors duration-150"
              >
                Back to All Blogs
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-gray-600 text-sm">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const showEdit = canEditBlog(blog)
  const showDelete = canDeleteBlog(blog)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                {getAvatar(blog.authorRole)}
                <span className="text-sm font-medium text-gray-700">
                  {blog.authorDisplayName}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {formatDate(blog.createdAt)}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {blog.title}
            </h1>

            <div className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
              {blog.content}
            </div>

            {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
              <p className="text-xs text-gray-400 mt-6">
                Last updated: {formatDate(blog.updatedAt)}
              </p>
            )}

            <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
              <Link
                to="/blogs"
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                ← Back to All Blogs
              </Link>

              {(showEdit || showDelete) && (
                <div className="flex items-center space-x-3">
                  {showEdit && (
                    <Link
                      to={`/blogs/${blog.blogId}/edit`}
                      className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                    >
                      Edit
                    </Link>
                  )}
                  {showDelete && (
                    <button
                      onClick={handleDelete}
                      className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 focus:outline-none"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
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