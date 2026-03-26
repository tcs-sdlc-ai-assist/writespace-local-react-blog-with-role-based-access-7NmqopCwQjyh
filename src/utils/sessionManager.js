import { getItem, setItem, removeItem } from './localStorageUtils.js'

const SESSION_KEY = 'writespace_session'

export function getSession() {
  return getItem(SESSION_KEY, null)
}

export function setSession(session) {
  return setItem(SESSION_KEY, session)
}

export function clearSession() {
  return removeItem(SESSION_KEY)
}

export function isAuthenticated() {
  const session = getSession()
  return session !== null && !!session.userId
}

export function getRole() {
  const session = getSession()
  return session ? session.role : null
}

export function getUsername() {
  const session = getSession()
  return session ? session.username : null
}

export function getCurrentUser() {
  const session = getSession()
  if (!session) {
    return null
  }
  return {
    userId: session.userId,
    username: session.username,
    displayName: session.displayName,
    role: session.role,
  }
}