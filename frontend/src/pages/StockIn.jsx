import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../Contexts/AuthContext'
import toast from 'react-hot-toast'

const StockIn = () => {
  const { isManager } = useAuth()

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
      const response = await axios.get('https://stock-kyq88mg4.b4a.run/api/spare-parts')
      setSpareParts(response.data)
    } catch (error) {
      toast.error('Failed to fetch spare parts')
    }
  }

  const fetchHistory = async () => {
    try {
      const response = await axios.get('https://stock-kyq88mg4.b4a.run/api/stock-in')
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
      await axios.post('https://stock-kyq88mg4.b4a.run/api/stock-in', {
        sparePartId: selectedPart,
        quantity: parseInt(quantity)
      })

      toast.success('Stock in added successfully')
      setSelectedPart('')
      setQuantity(1)
      fetchSpareParts()
      fetchHistory()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add stock in')
    } finally {
      setLoading(false)
    }
  }

  const selectedSparePart = spareParts.find(p => p._id === selectedPart)

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Stock In</h1>
        <p className="text-gray-500">Add inventory to your system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl shadow-md border p-6 space-y-4">

          <h2 className="text-lg font-semibold text-gray-800">
            Add Stock to Inventory
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* SELECT */}
            <div>
              <label className="text-sm text-gray-600">Spare Part</label>
              <select
                value={selectedPart}
                onChange={(e) => setSelectedPart(e.target.value)}
                className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="">Select item...</option>
                {spareParts.map(part => (
                  <option key={part._id} value={part._id}>
                    {part.name} (Stock: {part.quantity})
                  </option>
                ))}
              </select>
            </div>

            {/* INFO BOX */}
            {selectedSparePart && (
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
                <p className="text-sm text-gray-700">
                  Current Stock: <b>{selectedSparePart.quantity}</b>
                </p>
                <p className="text-sm text-gray-700">
                  Unit Price: <b>RWF {selectedSparePart.unitPrice.toLocaleString()}</b>
                </p>
              </div>
            )}

            {/* QUANTITY */}
            <div>
              <label className="text-sm text-gray-600">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                min="1"
              />
            </div>

            {/* PREVIEW */}
            {selectedSparePart && (
              <div className="bg-green-50 border border-green-200 p-3 rounded-xl">
                <p className="font-semibold text-green-700">
                  New Stock: {selectedSparePart.quantity + quantity}
                </p>
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-green-600 to-green-700 text-white p-3 rounded-xl hover:scale-[1.02] transition"
            >
              {loading ? 'Processing...' : 'Add Stock In'}
            </button>

          </form>
        </div>

        {/* HISTORY CARD */}
        <div className="bg-white rounded-2xl shadow-md border p-6">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Stock In History
          </h2>

          <div className="space-y-3 max-h-125 overflow-y-auto">

            {history.map((item) => (
              <div
                key={item._id}
                className="p-4 rounded-xl border bg-gray-50 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">

                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.sparePartName}
                    </p>
                    <p className="text-sm text-green-600">
                      +{item.quantity} Stock In
                    </p>
                  </div>

                  <div className="text-right text-xs text-gray-500">
                    <p>{new Date(item.date).toLocaleDateString()}</p>
                    <p>{new Date(item.date).toLocaleTimeString()}</p>
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
                No stock in history yet
              </p>
            )}

          </div>

        </div>
      </div>
    </div>
  )
}

export default StockIn