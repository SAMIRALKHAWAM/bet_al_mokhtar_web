import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getWarehouseItems } from './Warehouse'

const WarehouseDetails = () => {
  const { id } = useParams()
  const [items, setItems] = useState([])

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getWarehouseItems(id)
      setItems(data)
    }
    fetchItems()
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
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
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
