import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Contexts/AuthContext'
import {
  HomeIcon,
  PackageIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  FileTextIcon,
  UsersIcon,
  LogOutIcon
} from 'lucide-react'

const Layout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HomeIcon, roles: ['admin', 'manager', 'viewer'] },
    { path: '/spare-parts', label: 'Spare Parts', icon: PackageIcon, roles: ['admin', 'manager', 'viewer'] },
    { path: '/stock-in', label: 'Stock In', icon: TrendingUpIcon, roles: ['admin', 'manager'] },
    { path: '/stock-out', label: 'Stock Out', icon: TrendingDownIcon, roles: ['admin', 'manager'] },
    { path: '/reports', label: 'Reports', icon: FileTextIcon, roles: ['admin', 'manager', 'viewer'] },
    { path: '/users', label: 'Users', icon: UsersIcon, roles: ['admin'] }
  ]

  const visibleNavItems = navItems.filter(item =>
    item.roles.includes(user?.role)
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">

            {/* LEFT LOGO + MENU */}
            <div className="flex items-center space-x-10">

              <Link
                to="/dashboard"
                className="text-lg font-bold tracking-wide text-white hover:text-blue-400 transition"
              >
                SIMS <span className="text-gray-400">Inventory</span>
              </Link>

              {/* NAV LINKS */}
              <div className="hidden md:flex space-x-2">
                {visibleNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* RIGHT USER */}
            <div className="flex items-center gap-4">

              {/* USER BADGE */}
              <div className="hidden md:flex flex-col items-end text-right">
                <span className="text-sm font-medium text-white">
                  {user?.name}
                </span>
                <span className="text-xs text-gray-400 capitalize">
                  {user?.role}
                </span>
              </div>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm transition"
              >
                <LogOutIcon className="w-4 h-4" />
                Logout
              </button>

            </div>

          </div>
        </div>
      </nav>

      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>

    </div>
  )
}

export default Layout