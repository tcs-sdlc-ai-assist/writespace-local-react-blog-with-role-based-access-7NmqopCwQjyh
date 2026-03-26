import { getItem, setItem } from './localStorageUtils.js'
import { getCurrentUser } from './sessionManager.js'

const BLOGS_KEY = 'writespace_blogs'

function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9)
}

function getBlogs() {
  const blogs = getItem(BLOGS_KEY, [])
  return blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

function saveBlogs(blogs) {
  return setItem(BLOGS_KEY, blogs)
}

export function getAllBlogs() {
  return getBlogs()
}

export function getBlogById(blogId) {
  if (!blogId) {
    return null
  }
  const blogs = getBlogs()
  return blogs.find((b) => b.blogId === blogId) || null
}

export function createBlog(title, content) {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      return { success: false, error: 'You must be logged in to create a blog post.' }
    }

    if (!title || !content) {
      return { success: false, error: 'Title and content are required.' }
    }

    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()

    if (!trimmedTitle || !trimmedContent) {
      return { success: false, error: 'Title and content are required.' }
    }

    if (trimmedTitle.length > 100) {
      return { success: false, error: 'Title must be at most 100 characters.' }
    }

    if (trimmedContent.length > 1000) {
      return { success: false, error: 'Content must be at most 1000 characters.' }
    }

    const now = new Date().toISOString()
    const newBlog = {
      blogId: generateId(),
      title: trimmedTitle,
      content: trimmedContent,
      authorId: currentUser.userId,
      authorDisplayName: currentUser.displayName,
      authorRole: currentUser.role,
      createdAt: now,
      updatedAt: now,
    }

    const blogs = getItem(BLOGS_KEY, [])
    blogs.push(newBlog)
    const saved = saveBlogs(blogs)

    if (!saved) {
      return { success: false, error: 'Failed to save blog post. Please try again.' }
    }

    return { success: true, blog: newBlog }
  } catch (error) {
    console.error('Error creating blog:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}

export function editBlog(blogId, title, content) {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      return { success: false, error: 'You must be logged in to edit a blog post.' }
    }

    if (!blogId) {
      return { success: false, error: 'Blog ID is required.' }
    }

    if (!title || !content) {
      return { success: false, error: 'Title and content are required.' }
    }

    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()

    if (!trimmedTitle || !trimmedContent) {
      return { success: false, error: 'Title and content are required.' }
    }

    if (trimmedTitle.length > 100) {
      return { success: false, error: 'Title must be at most 100 characters.' }
    }

    if (trimmedContent.length > 1000) {
      return { success: false, error: 'Content must be at most 1000 characters.' }
    }

    const blogs = getItem(BLOGS_KEY, [])
    const blogIndex = blogs.findIndex((b) => b.blogId === blogId)

    if (blogIndex === -1) {
      return { success: false, error: 'Blog post not found.' }
    }

    const blog = blogs[blogIndex]

    if (currentUser.role !== 'admin' && blog.authorId !== currentUser.userId) {
      return { success: false, error: 'You do not have permission to edit this blog post.' }
    }

    blogs[blogIndex] = {
      ...blog,
      title: trimmedTitle,
      content: trimmedContent,
      updatedAt: new Date().toISOString(),
    }

    const saved = saveBlogs(blogs)

    if (!saved) {
      return { success: false, error: 'Failed to save blog post. Please try again.' }
    }

    return { success: true, blog: blogs[blogIndex] }
  } catch (error) {
    console.error('Error editing blog:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}

export function deleteBlog(blogId) {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      return { success: false, error: 'You must be logged in to delete a blog post.' }
    }

    if (!blogId) {
      return { success: false, error: 'Blog ID is required.' }
    }

    const blogs = getItem(BLOGS_KEY, [])
    const blogIndex = blogs.findIndex((b) => b.blogId === blogId)

    if (blogIndex === -1) {
      return { success: false, error: 'Blog post not found.' }
    }

    const blog = blogs[blogIndex]

    if (currentUser.role !== 'admin' && blog.authorId !== currentUser.userId) {
      return { success: false, error: 'You do not have permission to delete this blog post.' }
    }

    blogs.splice(blogIndex, 1)
    const saved = saveBlogs(blogs)

    if (!saved) {
      return { success: false, error: 'Failed to delete blog post. Please try again.' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting blog:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}

export function canEditBlog(blog) {
  const currentUser = getCurrentUser()
  if (!currentUser || !blog) {
    return false
  }
  if (currentUser.role === 'admin') return true
  return blog.authorId === currentUser.userId
}

export function canDeleteBlog(blog) {
  const currentUser = getCurrentUser()
  if (!currentUser || !blog) {
    return false
  }
  if (currentUser.role === 'admin') return true
  return blog.authorId === currentUser.userId
}