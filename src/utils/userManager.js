import { getItem, setItem } from './localStorageUtils.js'
import { getCurrentUser } from './sessionManager.js'

const USERS_KEY = 'writespace_users'

const ADMIN_USER = {
  id: 'admin-001',
  username: 'admin',
  displayName: 'Admin',
  role: 'admin',
}

function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9)
}

function getUsers() {
  const users = getItem(USERS_KEY, [])
  return users.map((u) => ({
    id: u.id,
    username: u.username,
    displayName: u.displayName,
    role: u.role,
  }))
}

export function getAllUsers() {
  const users = getUsers()
  const hasAdmin = users.some((u) => u.id === ADMIN_USER.id)
  if (!hasAdmin) {
    return [
      {
        id: ADMIN_USER.id,
        username: ADMIN_USER.username,
        displayName: ADMIN_USER.displayName,
        role: ADMIN_USER.role,
      },
      ...users,
    ]
  }
  return users
}

export function createUser(displayName, username, password, role) {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      return { success: false, error: 'You must be logged in to create a user.' }
    }

    if (currentUser.role !== 'admin') {
      return { success: false, error: 'Only admins can create users.' }
    }

    if (!displayName || !username || !password || !role) {
      return { success: false, error: 'All fields are required.' }
    }

    const trimmedDisplayName = displayName.trim()
    const trimmedUsername = username.trim().toLowerCase()
    const trimmedPassword = password.trim()
    const trimmedRole = role.trim().toLowerCase()

    if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword || !trimmedRole) {
      return { success: false, error: 'All fields are required.' }
    }

    if (trimmedDisplayName.length < 2 || trimmedDisplayName.length > 32) {
      return { success: false, error: 'Display name must be between 2 and 32 characters.' }
    }

    const displayNameRegex = /^[a-zA-Z0-9 ]+$/
    if (!displayNameRegex.test(trimmedDisplayName)) {
      return { success: false, error: 'Display name must not contain special characters.' }
    }

    if (trimmedPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' }
    }

    if (trimmedRole !== 'admin' && trimmedRole !== 'viewer') {
      return { success: false, error: 'Role must be either admin or viewer.' }
    }

    if (trimmedUsername === ADMIN_USER.username) {
      return { success: false, error: 'Username already exists.' }
    }

    const users = getItem(USERS_KEY, [])
    const existingUser = users.find((u) => u.username === trimmedUsername)

    if (existingUser) {
      return { success: false, error: 'Username already exists.' }
    }

    const newUser = {
      id: generateId(),
      username: trimmedUsername,
      displayName: trimmedDisplayName,
      password: trimmedPassword,
      role: trimmedRole,
    }

    users.push(newUser)
    const saved = setItem(USERS_KEY, users)

    if (!saved) {
      return { success: false, error: 'Failed to save user. Please try again.' }
    }

    return {
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        displayName: newUser.displayName,
        role: newUser.role,
      },
    }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}

export function deleteUser(userId) {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      return { success: false, error: 'You must be logged in to delete a user.' }
    }

    if (currentUser.role !== 'admin') {
      return { success: false, error: 'Only admins can delete users.' }
    }

    if (!userId) {
      return { success: false, error: 'User ID is required.' }
    }

    if (userId === ADMIN_USER.id) {
      return { success: false, error: 'Cannot delete the default admin account.' }
    }

    if (userId === currentUser.userId) {
      return { success: false, error: 'You cannot delete your own account.' }
    }

    const users = getItem(USERS_KEY, [])
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex === -1) {
      return { success: false, error: 'User not found.' }
    }

    users.splice(userIndex, 1)
    const saved = setItem(USERS_KEY, users)

    if (!saved) {
      return { success: false, error: 'Failed to delete user. Please try again.' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}

export function canDeleteUser(user) {
  const currentUser = getCurrentUser()
  if (!currentUser || !user) {
    return false
  }
  if (currentUser.role !== 'admin') {
    return false
  }
  if (user.id === ADMIN_USER.id) {
    return false
  }
  if (user.id === currentUser.userId) {
    return false
  }
  return true
}