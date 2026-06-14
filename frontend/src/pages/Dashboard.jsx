import React, { useState, useEffect } from 'react'
import { useAuth } from '../Contexts/AuthContext'
import {
  PackageIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  AlertCircleIcon
} from 'lucide-react'
import api from '../../api/api'

const Dashboard = () => {
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSpareParts: 0,
    totalStockValue: 0,
    totalStockOutToday: 0,
    lowStockItems: []
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [stockStatusRes, lowStockRes] = await Promise.all([
        api.get('api/reports/daily-stock-status'),
        api.get('api/reports/low-stock-alert')
      ])

      setStats({
        totalSpareParts: stockStatusRes.data.report?.length || 0,
        totalStockValue: stockStatusRes.data.summary?.totalStockValue || 0,
        totalStockOutToday: stockStatusRes.data.summary?.totalStockOutToday || 0,
        lowStockItems: lowStockRes.data || []
      })
    } catch (error) {
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Spare Parts',
      value: stats.totalSpareParts,
      icon: PackageIcon,
      color: 'from-blue-600 to-indigo-700'
    },
    {
      title: 'Total Stock Value',
      value: `RWF ${(stats.totalStockValue || 0).toLocaleString()}`,
      icon: PackageIcon,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: "Today's Stock Out",
      value: stats.totalStockOutToday,
      icon: TrendingDownIcon,
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems.length,
      icon: AlertCircleIcon,
      color: 'from-pink-500 to-red-600'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8 space-y-6">
        <div className="h-8 w-56 bg-gray-200 rounded-xl animate-pulse"></div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="h-28 bg-white rounded-3xl shadow animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 p-8 space-y-10">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Welcome back,{" "}
          <span className="font-semibold text-gray-900">{user?.name}</span>
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="relative group overflow-hidden rounded-3xl bg-white shadow-md border border-gray-100 p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            {/* Gradient background glow */}
            <div
              className={`absolute inset-0 opacity-10 bg-linear-to-r ${card.color}`}
            />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  {card.title}
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>

              <div
                className={`p-3 rounded-2xl bg-linear-to-r ${card.color} text-white shadow-lg group-hover:scale-110 transition`}
              >
                <card.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockItems.length > 0 && (
        <div className="rounded-3xl bg-red-50 border border-red-200 shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4 text-red-700 font-semibold text-lg">
            <AlertCircleIcon className="w-5 h-5" />
            Low Stock Alert
          </div>

          <div className="space-y-3">
            {stats.lowStockItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition"
              >
                <span className="font-medium text-gray-800">
                  {item.name}
                </span>
                <span className="text-red-600 font-bold text-lg">
                  {item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <button className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-2xl shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
            <TrendingUpIcon className="w-5 h-5" />
            Stock In
          </button>

          <button className="bg-linear-to-r from-orange-500 to-red-500 text-white p-5 rounded-2xl shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
            <TrendingDownIcon className="w-5 h-5" />
            Stock Out
          </button>

          <button className="bg-linear-to-r from-emerald-500 to-green-600 text-white p-5 rounded-2xl shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
            <PackageIcon className="w-5 h-5" />
            Add Part
          </button>

        </div>
      </div>

    </div>
  )
}

export default Dashboard