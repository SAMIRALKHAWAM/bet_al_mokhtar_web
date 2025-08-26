import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { BasicMultiSelect } from '../../components/ui/BasicMultiSelect'

import {
  fetchOffers,
  fetchDiscounts,
  fetchBranches,
  fetchItems,
  createOffer,
  createDiscount
} from '../../services/offer_discount'
import { getBranchId } from '../../utils/api'

const OffersAndDiscountsPage = () => {
  const [offers, setOffers] = useState([])
  const [discounts, setDiscounts] = useState([])
  const [branches, setBranches] = useState([])
  const [items, setItems] = useState([])

  const [showOfferForm, setShowOfferForm] = useState(false)
  const [showDiscountForm, setShowDiscountForm] = useState(false)

  const [newOffer, setNewOffer] = useState({
    name: '',
    description: '',
    from_date: '',
    to_date: '',
    items: [{ item_id: '', price: '', quantity: '' }],
    branches: []
  })

  const [newDiscount, setNewDiscount] = useState({
    name: '',
    code: '',
    percent: '',
    from_date: '',
    to_date: '',
    branches: []
  })


  useEffect(() => {
    loadBranches()
    loadDiscounts()
    loadItems()
  }, [])

  
  useEffect(() => {
    if (branches.length > 0) {
      loadOffers()
    }
  }, [branches])

  const loadOffers = async () => {
    try {
      //  const branchId = localStorage.getItem("branch_id")
       const branchId =getBranchId()
      if (!branchId) {
        console.warn("🚫 ما في branchId متاح")
        return
      }

      const res = await fetchOffers(branchId)
      setOffers(res.data.data)
    } catch (error) {
      console.error(error)
      toast.error('فشل في جلب العروض')
    }
  }

  const loadDiscounts = async () => {
    try {
      const res = await fetchDiscounts()
      setDiscounts(res.data.data)
    } catch {
      toast.error('فشل في جلب الخصومات')
    }
  }

  const loadBranches = async () => {
    try {
      const res = await fetchBranches()
      setBranches(res.data.data)
    } catch {
      toast.error('فشل في جلب الفروع')
    }
  }

  const loadItems = async () => {
    try {
      const res = await fetchItems()
      setItems(res.data.data)
    } catch {
      toast.error('فشل في جلب الأصناف')
    }
  }

  const handleCreateOffer = async () => {
    try {
      await createOffer(newOffer)
      toast.success('تم إنشاء العرض')
      loadOffers()
      setShowOfferForm(false)
      setNewOffer({
        name: '',
        description: '',
        from_date: '',
        to_date: '',
        items: [{ item_id: '', price: '', quantity: '' }],
        branches: []
      })
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل في إنشاء العرض')
    }
  }

  const handleCreateDiscount = async () => {
    try {
      await createDiscount(newDiscount)
      toast.success('تم إنشاء الخصم')
      loadDiscounts()
      setShowDiscountForm(false)
      setNewDiscount({
        name: '',
        code: '',
        percent: '',
        from_date: '',
        to_date: '',
        branches: []
      })
    } catch {
      toast.error('فشل في إنشاء الخصم')
    }
  }

  const addOfferItem = () => {
    setNewOffer({
      ...newOffer,
      items: [...newOffer.items, { item_id: '', price: '', quantity: '' }]
    })
  }

  const removeOfferItem = (index) => {
    const updated = [...newOffer.items]
    updated.splice(index, 1)
    setNewOffer({
      ...newOffer,
      items: updated.length ? updated : [{ item_id: '', price: '', quantity: '' }]
    })
  }

  return (
    <div className="p-6 space-y-10 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">📋 العروض والخصومات</h1>

    
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">🛍️ العروض</h2>
          {!showOfferForm && (
            <Button onClick={() => setShowOfferForm(true)}>+ إضافة عرض</Button>
          )}
        </div>

        {showOfferForm && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4 mb-6">
            <h3 className="text-xl font-bold">إضافة عرض جديد</h3>
            <Input placeholder="الاسم" value={newOffer.name} onChange={e => setNewOffer({ ...newOffer, name: e.target.value })} />
            <Textarea placeholder="الوصف" value={newOffer.description} onChange={e => setNewOffer({ ...newOffer, description: e.target.value })} />
            <Input type="date" value={newOffer.from_date} onChange={e => setNewOffer({ ...newOffer, from_date: e.target.value })} />
            <Input type="date" value={newOffer.to_date} onChange={e => setNewOffer({ ...newOffer, to_date: e.target.value })} />

            <h4 className="font-semibold mt-4">الأصناف</h4>
            {newOffer.items.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center mb-2">
                <select
                  className="w-1/3 p-2 rounded border"
                  value={item.item_id}
                  onChange={e => {
                    const updatedItems = [...newOffer.items]
                    updatedItems[idx].item_id = e.target.value
                    setNewOffer({ ...newOffer, items: updatedItems })
                  }}
                >
                  <option value="">اختر صنف</option>
                  {items.map(i => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>

                <Input
                  placeholder="السعر"
                  type="number"
                  value={item.price}
                  onChange={e => {
                    const updatedItems = [...newOffer.items]
                    updatedItems[idx].price = e.target.value
                    setNewOffer({ ...newOffer, items: updatedItems })
                  }}
                />

                <Input
                  placeholder="الكمية"
                  type="number"
                  value={item.quantity}
                  onChange={e => {
                    const updatedItems = [...newOffer.items]
                    updatedItems[idx].quantity = e.target.value
                    setNewOffer({ ...newOffer, items: updatedItems })
                  }}
                />

                <Button variant="outline" onClick={() => removeOfferItem(idx)}>-</Button>
              </div>
            ))}

            <Button variant="outline" onClick={addOfferItem}>+ إضافة صنف آخر</Button>

            <section className="mt-6">
              <h2 className="text-2xl font-semibold mb-2">📍 اختر الفروع</h2>
              <BasicMultiSelect
                options={branches.map(b => ({ label: b.name, value: b.id }))}
                selected={newOffer.branches}
                onChange={selected => setNewOffer({ ...newOffer, branches: selected })}
              />
            </section>

            <div className="flex gap-2 mt-4">
              <Button onClick={handleCreateOffer}>حفظ</Button>
              <Button variant="outline" onClick={() => setShowOfferForm(false)}>إلغاء</Button>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {offers.map(offer => (
            <div key={offer.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <h3 className="font-bold text-lg">{offer.name}</h3>
              <p>{offer.description}</p>
              <p className="text-sm text-gray-500 mt-1">من {offer.from_date} إلى {offer.to_date}</p>
            </div>
          ))}
        </div>
      </section>

      {/* خصومات */}
      <section>
        <div className="flex justify-between items-center mb-4 mt-10">
          <h2 className="text-2xl font-semibold">💸 الخصومات</h2>
          {!showDiscountForm && (
            <Button onClick={() => setShowDiscountForm(true)}>+ إضافة خصم</Button>
          )}
        </div>

        {showDiscountForm && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4 mb-6">
            <h3 className="text-xl font-bold">إضافة خصم جديد</h3>
            <Input placeholder="الاسم" value={newDiscount.name} onChange={e => setNewDiscount({ ...newDiscount, name: e.target.value })} />
            <Input placeholder="الكود" value={newDiscount.code} onChange={e => setNewDiscount({ ...newDiscount, code: e.target.value })} />
            <Input type="number" placeholder="النسبة المئوية (%)" value={newDiscount.percent} onChange={e => setNewDiscount({ ...newDiscount, percent: e.target.value })} />
            <Input type="date" value={newDiscount.from_date} onChange={e => setNewDiscount({ ...newDiscount, from_date: e.target.value })} />
            <Input type="date" value={newDiscount.to_date} onChange={e => setNewDiscount({ ...newDiscount, to_date: e.target.value })} />

            <div className="flex gap-2">
              <Button onClick={handleCreateDiscount}>حفظ</Button>
              <Button variant="outline" onClick={() => setShowDiscountForm(false)}>إلغاء</Button>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {discounts.map(discount => (
            <div key={discount.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <h3 className="font-bold text-lg">{discount.name}</h3>
              <p>الكود: {discount.code}</p>
              <p>النسبة: {discount.percent}%</p>
              <p className="text-sm text-gray-500 mt-1">من {discount.from_date} إلى {discount.to_date}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default OffersAndDiscountsPage
