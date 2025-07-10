import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { fetchWarehouseItems } from '../../services/warehouseServices'

const WarehouseDetails = () => {
  const { id } = useParams()
  const [items, setItems] = useState([])

  const loadWarehouseItems = async () => {
    try {
      const res = await fetchWarehouseItems(id)
      setItems(res.data.data)
    } catch {
      toast.error('فشل في جلب محتويات المستودع')
    }
  }

  useEffect(() => {
    loadWarehouseItems()
  }, [id])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">محتويات المستودع رقم {id}</h2>
      {items.length === 0 ? (
        <p>لا توجد مواد حالياً في هذا المستودع.</p>
      ) : (
        <table className="w-full table-auto border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">اسم المادة</th>
              <th className="p-3 border">الكمية</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-3 border">{item.name}</td>
                <td className="p-3 border">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default WarehouseDetails
