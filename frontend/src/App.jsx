
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import  AuthProvider  from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SpareParts from './pages/SpareParts'
import StockIn from './pages/StockIn'
import StockOut from './pages/StockOut'
import Reports from './pages/Reports'
import Users from './pages/Users'
import Layout from './components/Layout'

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="spare-parts" element={<SpareParts />} />
          <Route path="stock-in" element={<StockIn />} />
          <Route path="stock-out" element={<StockOut />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}        
export default App
