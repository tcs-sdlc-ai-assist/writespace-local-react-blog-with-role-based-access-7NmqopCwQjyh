import React from 'react'
import { Link } from 'react-router-dom'
import { getAllBlogs } from '../utils/blogManager.js'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import BlogCard from '../components/BlogCard.jsx'

export default function BlogListPage() {
  const blogs = getAllBlogs()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Blogs</h1>
              <p className="text-gray-600 text-sm mt-1">
                Browse the latest posts from our community
              </p>
            </div>
            <Link
              to="/blogs/new"
              className="bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2 rounded-md text-sm font-medium transition-colors duration-150"
            >
              + New Post
            </Link>
          </div>

          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog.blogId} blog={blog} />
              ))}
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
                Be the first to share your thoughts on WriteSpace!
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
      </main>

      <Footer />
    </div>
  )
}