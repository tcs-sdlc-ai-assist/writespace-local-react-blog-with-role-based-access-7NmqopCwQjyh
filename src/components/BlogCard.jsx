import React from 'react'
import { Link } from 'react-router-dom'
import { getAvatar } from './Avatar.jsx'
import { canEditBlog } from '../utils/blogManager.js'

function truncateContent(content, maxLength = 150) {
  if (!content) return ''
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength).trimEnd() + '...'
}

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

export default function BlogCard({ blog }) {
  if (!blog) {
    return null
  }

  const showEdit = canEditBlog(blog)

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
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

        <Link to={`/blog/${blog.blogId}`} className="group flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-150 mb-2 line-clamp-2">
            {blog.title}
          </h3>
          <p className="text-gray-600 text-sm flex-1">
            {truncateContent(blog.content)}
          </p>
        </Link>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <Link
            to={`/blog/${blog.blogId}`}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Read more →
          </Link>

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
        </div>
      </div>
    </div>
  )
}