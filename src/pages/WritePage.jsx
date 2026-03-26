import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBlogById, createBlog, editBlog, canEditBlog } from '../utils/blogManager.js'
import { isAuthenticated } from '../utils/sessionManager.js'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const TITLE_MAX_LENGTH = 100
const CONTENT_MAX_LENGTH = 1000

export default function WritePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true })
      return
    }

    if (isEditMode) {
      const blog = getBlogById(id)

      if (!blog) {
        setError('Blog post not found.')
        return
      }

      if (!canEditBlog(blog)) {
        navigate('/blogs', { replace: true })
        return
      }

      setTitle(blog.title)
      setContent(blog.content)
    }
  }, [id, isEditMode, navigate])

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    let result

    if (isEditMode) {
      result = editBlog(id, title, content)
    } else {
      result = createBlog(title, content)
    }

    if (!result.success) {
      setError(result.error)
      setLoading(false)
      return
    }

    setLoading(false)
    navigate('/blogs')
  }

  function handleCancel() {
    navigate('/blogs')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit Post' : 'Create New Post'}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {isEditMode
                ? 'Update your blog post below'
                : 'Share your thoughts with the WriteSpace community'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your post title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {title.length}/{TITLE_MAX_LENGTH} characters
                </p>
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog content here..."
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-vertical"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {content.length}/{CONTENT_MAX_LENGTH} characters
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2 rounded-md text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? (isEditMode ? 'Saving...' : 'Publishing...')
                    : (isEditMode ? 'Save Changes' : 'Publish Post')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}