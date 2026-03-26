export function getItem(key, fallback = null) {
  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      return fallback
    }
    return JSON.parse(item)
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error)
    return fallback
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error)
    return false
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error)
    return false
  }
}