import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../Contexts/AuthContext'
import toast from 'react-hot-toast'
import { Trash2Icon } from 'lucide-react'
import api from '../../api/api'

const StockOut = () => {
  const { isAdmin, isManager } = useAuth()

  const [spareParts, setSpareParts] = useState([])
  const [selectedPart, setSelectedPart] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  useEffect(() => {
    fetchSpareParts()
    fetchHistory()
  }, [])

  const fetchSpareParts = async () => {
    try {
      const response = await api.get('api/spare-parts')
      setSpareParts(response.data)
    } catch (error) {
      toast.error('Failed to fetch spare parts')
    }
  }

  const fetchHistory = async () => {
    try {
      const response = await api.get('api/stock-out')
      setHistory(response.data)
    } catch (error) {
      console.error('Failed to fetch history')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedPart) return toast.error('Please select a spare part')
    if (quantity < 1) return toast.error('Quantity must be at least 1')

    setLoading(true)

    try {
      await api.post('api/stock-out', {
        sparePartId: selectedPart,
        quantity: parseInt(quantity)
      })

      toast.success('Stock out recorded successfully')
      setSelectedPart('')
      setQuantity(1)
      fetchSpareParts()
      fetchHistory()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record stock out')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!isAdmin) return toast.error('Only admins can delete stock out records')

    if (window.confirm('Are you sure? This will restore inventory.')) {
      try {
        await api.delete(`api/stock-out/${id}`)
        toast.success('Deleted successfully')
        fetchSpareParts()
        fetchHistory()
      } catch (error) {
        toast.error('Failed to delete record')
      }
    }
  }

  const selectedSparePart = spareParts.find(p => p._id === selectedPart)

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Stock Out</h1>
        <p className="text-gray-500">Remove items from inventory</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-md p-6 border">
          <h2 className="text-lg font-semibold mb-4">Record Stock Out</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* select */}
            <div>
              <label className="text-sm text-gray-600">Spare Part</label>
              <select
                value={selectedPart}
                onChange={(e) => setSelectedPart(e.target.value)}
                className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select item...</option>
                {spareParts.map(part => (
                  <option key={part._id} value={part._id}>
                    {part.name} (Stock: {part.quantity})
                  </option>
                ))}
              </select>
            </div>

            {/* info */}
            {selectedSparePart && (
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
                <p className="text-sm">Available: <b>{selectedSparePart.quantity}</b></p>
                <p className="text-sm">Unit Price: <b>RWF {selectedSparePart.unitPrice.toLocaleString()}</b></p>
              </div>
            )}

            {/* quantity */}
            <div>
              <label className="text-sm text-gray-600">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                min="1"
              />
            </div>

            {/* preview */}
            {selectedSparePart && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl">
                <p className="font-semibold">
                  Total: RWF {(quantity * selectedSparePart.unitPrice).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Remaining: {selectedSparePart.quantity - quantity}
                </p>
              </div>
            )}

            {/* button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-blue-600 to-blue-700 text-white p-3 rounded-xl hover:scale-[1.02] transition"
            >
              {loading ? 'Processing...' : 'Record Stock Out'}
            </button>

          </form>
        </div>

        {/* HISTORY */}
        <div className="bg-white rounded-2xl shadow-md p-6 border">
          <h2 className="text-lg font-semibold mb-4">Stock Out History</h2>

          <div className="space-y-3 max-h-125 overflow-y-auto">

            {history.map(item => (
              <div
                key={item._id}
                className="p-4 border rounded-xl hover:shadow-md transition bg-gray-50"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{item.sparePartName}</p>
                    <p className="text-sm text-gray-500">
                      Qty: -{item.quantity}
                    </p>
                    <p className="text-sm text-red-600 font-bold">
                      RWF {item.totalPrice.toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(item.date).toLocaleDateString()}
                    </p>

                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800 mt-2"
                      >
                        <Trash2Icon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {item.createdBy && (
                  <p className="text-xs text-gray-400 mt-2">
                    By: {item.createdBy.name}
                  </p>
                )}
              </div>
            ))}

            {history.length === 0 && (
              <p className="text-center text-gray-400">
                No stock out history yet
              </p>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}

export default StockOut