import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../Contexts/AuthContext'
import toast from 'react-hot-toast'
import { Trash2Icon, UserPlusIcon } from 'lucide-react'
import api from '../../api/api'

const Users = () => {
  const { isAdmin, user: currentUser } = useAuth()

  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer'
  })

  useEffect(() => {
    if (isAdmin) fetchUsers()
  }, [isAdmin])

  const fetchUsers = async () => {
    try {
      const response = await api.get('api/users')
      setUsers(response.data)
    } catch (error) {
      toast.error('Failed to fetch users')
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    try {
      await api.post('api/auth/register', formData)
      toast.success('User created successfully')
      fetchUsers()
      setShowModal(false)
      setFormData({ name: '', email: '', password: '', role: 'viewer' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user')
    }
  }

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await api.put(`api/users/${userId}/role`, { role: newRole })
      toast.success('User role updated')
      fetchUsers()
    } catch (error) {
      toast.error('Failed to update role')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (userId === currentUser?.id) {
      toast.error('You cannot delete your own account')
      return
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`api/users/${userId}`)
        toast.success('User deleted successfully')
        fetchUsers()
      } catch (error) {
        toast.error('Failed to delete user')
      }
    }
  }

  if (!isAdmin) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-semibold">Access denied. Admin only.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-500">Manage system users and roles</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition"
        >
          <UserPlusIcon className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-md rounded-2xl overflow-hidden border">

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Created</th>
                <th className="text-center px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">

                  <td className="px-4 py-3 font-medium text-gray-800">
                    {user.name}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {user.email}
                  </td>

                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                      disabled={user._id === currentUser?.id}
                      className="border rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </td>

                  <td className="px-4 py-3 text-gray-500 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={user._id === currentUser?.id}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">

            <h2 className="text-xl font-bold mb-4">Add New User</h2>

            <form onSubmit={handleCreateUser} className="space-y-4">

              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />

              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="viewer">Viewer</option>
              </select>

              <div className="flex gap-3 pt-2">

                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                >
                  Create
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  )
}

export default Users