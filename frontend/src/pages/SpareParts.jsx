import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../Contexts/AuthContext'
import toast from 'react-hot-toast'
import { Edit2Icon, Trash2Icon, PlusIcon } from 'lucide-react'

const SpareParts = () => {
  const { isAdmin, isManager } = useAuth()

  const [spareParts, setSpareParts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingPart, setEditingPart] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    unitPrice: 0
  })

  useEffect(() => {
    fetchSpareParts()
  }, [])

  const fetchSpareParts = async () => {
    try {
      const response = await axios.get('https://stock-kyq88mg4.b4a.run/api/spare-parts')
      setSpareParts(response.data)
    } catch (error) {
      toast.error('Failed to fetch spare parts')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingPart) {
        await axios.put(
          `https://stock-kyq88mg4.b4a.run/api/spare-parts/${editingPart._id}`,
          formData
        )
        toast.success('Updated successfully')
      } else {
        await axios.post('https://stock-kyq88mg4.b4a.run/api/spare-parts', formData)
        toast.success('Created successfully')
      }

      fetchSpareParts()
      setShowModal(false)
      resetForm()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this spare part?')) {
      try {
        await axios.delete(`https://stock-kyq88mg4.b4a.run/api/spare-parts/${id}`)
        toast.success('Deleted successfully')
        fetchSpareParts()
      } catch (error) {
        toast.error('Failed to delete')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      quantity: 0,
      unitPrice: 0
    })
    setEditingPart(null)
  }

  const openEditModal = (part) => {
    setEditingPart(part)
    setFormData({
      name: part.name,
      category: part.category,
      quantity: part.quantity,
      unitPrice: part.unitPrice
    })
    setShowModal(true)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Spare Parts</h1>
          <p className="text-gray-500">Manage inventory items</p>
        </div>

        {(isAdmin || isManager) && (
          <button
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add Part
          </button>
        )}
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-md border overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-right">Qty</th>
              <th className="p-4 text-right">Unit Price</th>
              <th className="p-4 text-right">Total Value</th>
              {(isAdmin || isManager) && (
                <th className="p-4 text-center">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>

            {spareParts.map((part) => (
              <tr
                key={part._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium">{part.name}</td>
                <td className="p-4 text-gray-600">{part.category}</td>

                <td className="p-4 text-right">
                  <span className={part.quantity < 10 ? "text-red-600 font-bold" : ""}>
                    {part.quantity}
                  </span>
                </td>

                <td className="p-4 text-right">
                  RWF {part.unitPrice.toLocaleString()}
                </td>

                <td className="p-4 text-right font-semibold">
                  RWF {(part.quantity * part.unitPrice).toLocaleString()}
                </td>

                {(isAdmin || isManager) && (
                  <td className="p-4">
                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() => openEditModal(part)}
                        className="text-blue-600 hover:scale-110 transition"
                      >
                        <Edit2Icon className="w-4 h-4" />
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(part._id)}
                          className="text-red-600 hover:scale-110 transition"
                        >
                          <Trash2Icon className="w-4 h-4" />
                        </button>
                      )}

                    </div>
                  </td>
                )}

              </tr>
            ))}

          </tbody>
        </table>

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-fadeIn">

            <h2 className="text-xl font-bold mb-4">
              {editingPart ? 'Edit Spare Part' : 'Add Spare Part'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
              />

              <input
                placeholder="Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
              />

              <input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: parseInt(e.target.value) })
                }
                className="w-full p-3 border rounded-xl"
              />

              <input
                type="number"
                placeholder="Unit Price"
                value={formData.unitPrice}
                onChange={(e) =>
                  setFormData({ ...formData, unitPrice: parseInt(e.target.value) })
                }
                className="w-full p-3 border rounded-xl"
              />

              <div className="flex gap-3">

                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700"
                >
                  {editingPart ? 'Update' : 'Create'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="flex-1 bg-gray-200 p-3 rounded-xl hover:bg-gray-300"
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

export default SpareParts