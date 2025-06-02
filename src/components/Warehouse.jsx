// services/warehouseService.js

// تابع جلب المستودعات
export const getWarehouses = async () => {
  // مؤقتاً بيانات وهمية
  return [
    { id: 1, name: 'مستودع دمشق', location: 'دمشق' },
    { id: 2, name: 'مستودع حلب', location: 'حلب' },
    { id: 3, name: 'مستودع حمص', location: 'حمص' },
  ]
}

// تابع جلب مكونات مستودع معين
export const getWarehouseItems = async (warehouseId) => {
  // مؤقتاً بيانات وهمية
  const items = {
    1: [
      { name: 'سكر', quantity: 120 },
      { name: 'رز', quantity: 80 },
      { name: 'زيت', quantity: 45 },
    ],
    2: [
      { name: 'عدس', quantity: 200 },
      { name: 'فول', quantity: 130 },
    ],
    3: [
      { name: 'طحين', quantity: 300 },
      { name: 'معكرونة', quantity: 90 },
    ],
  }

  return items[warehouseId] || []
}
