import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import BlogListPage from './pages/BlogListPage.jsx'
import WritePage from './pages/WritePage.jsx'
import ReadPage from './pages/ReadPage.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import UserManagement from './pages/UserManagement.jsx'
import RouteGuard from './components/RouteGuard.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/blogs"
          element={
            <RouteGuard>
              <BlogListPage />
            </RouteGuard>
          }
        />
        <Route
          path="/blogs/new"
          element={
            <RouteGuard>
              <WritePage />
            </RouteGuard>
          }
        />
        <Route
          path="/blogs/:id/edit"
          element={
            <RouteGuard>
              <WritePage />
            </RouteGuard>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <RouteGuard>
              <ReadPage />
            </RouteGuard>
          }
        />
        <Route
          path="/admin"
          element={
            <RouteGuard requiredRole="admin">
              <AdminDashboard />
            </RouteGuard>
          }
        />
        <Route
          path="/users"
          element={
            <RouteGuard requiredRole="admin">
              <UserManagement />
            </RouteGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}