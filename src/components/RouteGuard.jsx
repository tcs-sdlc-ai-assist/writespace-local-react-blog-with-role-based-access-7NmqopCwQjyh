import React from 'react'
import { Navigate } from 'react-router-dom'
import { isAuthenticated, getRole } from '../utils/sessionManager.js'

export default function RouteGuard({ children, requiredRole }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && getRole() !== requiredRole) {
    return <Navigate to="/blogs" replace />
  }

  return children
}