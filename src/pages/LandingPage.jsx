import React from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../utils/sessionManager.js'
import { getAllBlogs } from '../utils/blogManager.js'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { getAvatar } from '../components/Avatar.jsx'

function truncateContent(content, maxLength = 120) {
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

export default function LandingPage() {
  const authenticated = isAuthenticated()
  const allBlogs = getAllBlogs()
  const latestPosts = allBlogs.slice(0, 3)

  const features = [
    {
      icon: '✍️',
      title: 'Write & Publish',
      description:
        'Create and publish your blog posts with an intuitive editor. Share your thoughts with the world in just a few clicks.',
    },
    {
      icon: '👥',
      title: 'Role-Based Access',
      description:
        'Admins manage users and all content. Viewers can create and manage their own posts with full ownership control.',
    },
    {
      icon: '⚡',
      title: 'Fast & Simple',
      description:
        'No complex setup required. Start writing immediately with a clean, responsive interface designed for speed.',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Welcome to <span className="text-indigo-200">WriteSpace</span>
            </h1>
            <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
              A clean, simple blogging platform where you can share your ideas,
              stories, and knowledge with the world.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/register"
                className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-md text-base font-semibold shadow-lg transition-colors duration-150 w-full sm:w-auto"
              >
                Get Started
              </Link>
              <Link
                to={authenticated ? '/blogs' : '/login'}
                className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-3 rounded-md text-base font-semibold transition-colors duration-150 w-full sm:w-auto"
              >
                Browse Blogs
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why WriteSpace?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Everything you need to start blogging, nothing you don't.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 text-3xl mb-4">
                    {feature.icon}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Posts Section */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Latest Posts
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Check out what our community has been writing about.
              </p>
            </div>

            {latestPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {latestPosts.map((blog) => (
                  <div
                    key={blog.blogId}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col"
                  >
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

                      <Link
                        to={authenticated ? `/blog/${blog.blogId}` : '/login'}
                        className="group flex-1 flex flex-col"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-150 mb-2 line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 text-sm flex-1">
                          {truncateContent(blog.content)}
                        </p>
                      </Link>

                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <Link
                          to={authenticated ? `/blog/${blog.blogId}` : '/login'}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          Read more →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
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
                  to="/register"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                >
                  Start Writing
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}