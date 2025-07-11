import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { fetchTaxes, createTax, updateTax, deleteTax } from '../../services/taxServices'

const TaxesPage = () => {
  const [taxes, setTaxes] = useState([])
  const [newTax, setNewTax] = useState({ name: '', percent: '' })
  const [editingTax, setEditingTax] = useState(null)

  const loadTaxes = async () => {
    try {
      const res = await fetchTaxes()
      setTaxes(res.data.data)
    } catch {
      toast.error('فشل في جلب الضرائب')
    }
  }

  useEffect(() => {
    loadTaxes()
  }, [])

  const handleCreateTax = async () => {
    try {
      await createTax(newTax)
      toast.success('تمت الإضافة')
      loadTaxes()
      setNewTax({ name: '', percent: '' })
    } catch {
      toast.error('فشل في الإضافة')
    }
  }

  const handleUpdateTax = async () => {
    try {
      await updateTax(editingTax.id, { name: editingTax.name, percent: editingTax.percent })
      toast.success('تم التحديث')
      loadTaxes()
      setEditingTax(null)
    } catch {
      toast.error('فشل في التحديث')
    }
  }

  const handleDeleteTax = async (id) => {
    if (!window.confirm('هل أنت متأكد من الحذف؟')) return
    try {
      await deleteTax(id)
      toast.success('تم الحذف')
      loadTaxes()
    } catch {
      toast.error('فشل في الحذف')
    }
  }

  return (
    <div dir="rtl" className="p-6 space-y-10 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">💰 الضرائب</h1>

      {/* إضافة ضريبة */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4 mb-6 text-right">
        <h3 className="text-xl font-bold">إضافة ضريبة جديدة</h3>
        <Input
          placeholder="اسم الضريبة"
          value={newTax.name}
          onChange={(e) => setNewTax({ ...newTax, name: e.target.value })}
          className="text-right"
        />
        <Input
          type="number"
          placeholder="النسبة (%)"
          value={newTax.percent}
          onChange={(e) => setNewTax({ ...newTax, percent: e.target.value })}
          className="text-right"
        />
        <div className="flex justify-end">
          <Button onClick={handleCreateTax}>إضافة</Button>
        </div>
      </div>

      {/* عرض وتعديل الضرائب */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {taxes.map((tax) => (
          <div key={tax.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow text-right">
            {editingTax?.id === tax.id ? (
              <>
                <Input
                  value={editingTax.name}
                  onChange={(e) => setEditingTax({ ...editingTax, name: e.target.value })}
                  className="text-right"
                />
                <Input
                  type="number"
                  value={editingTax.percent}
                  onChange={(e) => setEditingTax({ ...editingTax, percent: e.target.value })}
                  className="text-right"
                />
                <div className="flex gap-2 mt-2 justify-end">
                  <Button onClick={handleUpdateTax}>حفظ</Button>
                  <Button variant="outline" onClick={() => setEditingTax(null)}>إلغاء</Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-bold text-lg">{tax.name}</h3>
                <p className="mt-1">النسبة: %{tax.percent}</p>
                <div className="flex gap-2 mt-2 justify-end">
                  <Button className="bg-yellow-500" onClick={() => setEditingTax(tax)}>تعديل</Button>
                  <Button className="bg-red-600" onClick={() => handleDeleteTax(tax.id)}>حذف</Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TaxesPage
