import React, { useState, useEffect } from 'react'
import axios from 'axios'
import api from '../api/axios'
import { useAuth } from '../Contexts/AuthContext'
import { FileTextIcon, DownloadIcon } from 'lucide-react'

const Reports = () => {
  const { isViewer } = useAuth()

  const [stockStatus, setStockStatus] = useState(null)
  const [dailyStockOut, setDailyStockOut] = useState(null)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  useEffect(() => {
    fetchStockStatus()
    fetchDailyStockOut()
  }, [selectedDate])

  const fetchStockStatus = async () => {
    try {
      const response = await api.get(
        'api/reports/daily-stock-status'
      )
      setStockStatus(response.data)
    } catch (error) {
      console.error('Failed to fetch stock status')
    }
  }

  const fetchDailyStockOut = async () => {
    try {
      const response = await api.get(
        `api/reports/daily-stock-out?date=${selectedDate}`
      )
      setDailyStockOut(response.data)
    } catch (error) {
      console.error('Failed to fetch daily stock out')
    }
  }

  const exportToCSV = (data, filename) => {
    if (!data || !data.report) return

    const headers = Object.keys(data.report[0])
    const csvRows = [
      headers.join(','),
      ...data.report.map(row =>
        headers.map(header => JSON.stringify(row[header])).join(',')
      )
    ]

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Reports
        </h1>
        <p className="text-gray-500 mt-1">
          Stock analytics and daily activity reports
        </p>
      </div>

      {/* ================= STOCK STATUS ================= */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileTextIcon className="w-5 h-5 text-blue-600" />
            Daily Stock Status Report
          </h2>

          <button
            onClick={() =>
              exportToCSV(stockStatus, 'stock_status_report')
            }
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
          >
            <DownloadIcon className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {stockStatus && (
          <>
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-sm text-gray-600">Total Spare Parts</p>
                <p className="text-2xl font-bold text-blue-700">
                  {stockStatus.summary.totalParts}
                </p>
              </div>

              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <p className="text-sm text-gray-600">Total Stock Value</p>
                <p className="text-2xl font-bold text-green-700">
                  RWF {stockStatus.summary.totalStockValue.toLocaleString()}
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                <p className="text-sm text-gray-600">Today's Stock Out</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stockStatus.summary.totalStockOutToday}
                </p>
              </div>

            </div>

            {/* TABLE */}
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3 text-left">Spare Part</th>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-right">Stored Qty</th>
                    <th className="p-3 text-right">Stock Out</th>
                    <th className="p-3 text-right">Remaining</th>
                    <th className="p-3 text-right">Total Value</th>
                  </tr>
                </thead>

                <tbody>
                  {stockStatus.report.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{item.sparePartName}</td>
                      <td className="p-3">{item.category}</td>
                      <td className="p-3 text-right">{item.storedQuantity}</td>
                      <td className="p-3 text-right">{item.stockOutQuantity}</td>
                      <td className="p-3 text-right font-semibold">
                        {item.remainingQuantity}
                      </td>
                      <td className="p-3 text-right">
                        RWF {item.totalValue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ================= DAILY STOCK OUT ================= */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileTextIcon className="w-5 h-5 text-orange-600" />
            Daily Stock Out Report
          </h2>

          <div className="flex gap-3 items-center">

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {/* {dailyStockOut && (
              <button
                onClick={() =>
                  exportToCSV(dailyStockOut, 'daily_stock_out_report')
                }
                className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition flex items-center gap-2"
              >
                <DownloadIcon className="w-4 h-4" />
                Export
              </button>
            )} */}
          </div>
        </div>

        {dailyStockOut && (
          <>
            {/* SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

              <div className="bg-blue-50 border rounded-xl p-4">
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-bold text-blue-700">
                  {new Date(dailyStockOut.date).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-orange-50 border rounded-xl p-4">
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="font-bold text-orange-600">
                  RWF {dailyStockOut.totalValue?.toLocaleString() || 0}
                </p>
              </div>

            </div>

            {/* TABLE */}
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">

                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Spare Part</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Total</th>
                    <th className="p-3 text-left">Time</th>
                  </tr>
                </thead>

                <tbody>
                  {dailyStockOut.stockOuts?.map((item) => (
                    <tr
                      key={item._id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="p-3">{item.sparePartName}</td>
                      <td className="p-3 text-right">{item.quantity}</td>
                      <td className="p-3 text-right">
                        RWF {item.unitPrice.toLocaleString()}
                      </td>
                      <td className="p-3 text-right">
                        RWF {item.totalPrice.toLocaleString()}
                      </td>
                      <td className="p-3 text-gray-500">
                        {new Date(item.date).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {dailyStockOut.stockOuts?.length === 0 && (
              <p className="text-center text-gray-500 py-6">
                No stock out records for this date
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Reports