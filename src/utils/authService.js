import { getItem, setItem } from './localStorageUtils.js'
import { setSession } from './sessionManager.js'

const USERS_KEY = 'writespace_users'

const ADMIN_USER = {
  id: 'admin-001',
  username: 'admin',
  displayName: 'Admin',
  password: 'admin123',
  role: 'admin',
}

function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9)
}

function getUsers() {
  return getItem(USERS_KEY, [])
}

function saveUsers(users) {
  return setItem(USERS_KEY, users)
}

function createSession(user) {
  const session = {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  }
  setSession(session)
  return session
}

export function login(username, password) {
  try {
    if (!username || !password) {
      return { success: false, error: 'Username and password are required.' }
    }

    const trimmedUsername = username.trim().toLowerCase()
    const trimmedPassword = password.trim()

    if (!trimmedUsername || !trimmedPassword) {
      return { success: false, error: 'Username and password are required.' }
    }

    if (trimmedUsername === ADMIN_USER.username && trimmedPassword === ADMIN_USER.password) {
      const session = createSession(ADMIN_USER)
      return {
        success: true,
        user: {
          id: ADMIN_USER.id,
          username: ADMIN_USER.username,
          displayName: ADMIN_USER.displayName,
          role: ADMIN_USER.role,
        },
        session,
      }
    }

    const users = getUsers()
    const foundUser = users.find(
      (u) => u.username === trimmedUsername && u.password === trimmedPassword
    )

    if (!foundUser) {
      return { success: false, error: 'Invalid username or password.' }
    }

    const session = createSession(foundUser)
    return {
      success: true,
      user: {
        id: foundUser.id,
        username: foundUser.username,
        displayName: foundUser.displayName,
        role: foundUser.role,
      },
      session,
    }
  } catch (error) {
    console.error('Error during login:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}

export function register(displayName, username, password, confirmPassword) {
  try {
    if (!displayName || !username || !password || !confirmPassword) {
      return { success: false, error: 'All fields are required.' }
    }

    const trimmedDisplayName = displayName.trim()
    const trimmedUsername = username.trim().toLowerCase()
    const trimmedPassword = password.trim()
    const trimmedConfirmPassword = confirmPassword.trim()

    if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword || !trimmedConfirmPassword) {
      return { success: false, error: 'All fields are required.' }
    }

    if (trimmedDisplayName.length < 2 || trimmedDisplayName.length > 32) {
      return { success: false, error: 'Display name must be between 2 and 32 characters.' }
    }

    const displayNameRegex = /^[a-zA-Z0-9 ]+$/
    if (!displayNameRegex.test(trimmedDisplayName)) {
      return { success: false, error: 'Display name must not contain special characters.' }
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      return { success: false, error: 'Passwords do not match.' }
    }

    if (trimmedPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' }
    }

    if (trimmedUsername === ADMIN_USER.username) {
      return { success: false, error: 'Username already exists.' }
    }

    const users = getUsers()
    const existingUser = users.find((u) => u.username === trimmedUsername)

    if (existingUser) {
      return { success: false, error: 'Username already exists.' }
    }

    const newUser = {
      id: generateId(),
      username: trimmedUsername,
      displayName: trimmedDisplayName,
      password: trimmedPassword,
      role: 'viewer',
    }

    users.push(newUser)
    const saved = saveUsers(users)

    if (!saved) {
      return { success: false, error: 'Failed to save user. Please try again.' }
    }

    const session = createSession(newUser)
    return {
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        displayName: newUser.displayName,
        role: newUser.role,
      },
      session,
    }
  } catch (error) {
    console.error('Error during registration:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}