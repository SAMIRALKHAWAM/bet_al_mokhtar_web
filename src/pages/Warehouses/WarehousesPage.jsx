import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { fetchWarehouseByBranch } from '../../services/warehouseServices';


const WarehousesPage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const navigate = useNavigate();
  const { branchId } = useParams();

  const loadWarehouses = async () => {
    try {
     const res = await fetchWarehouseByBranch(branchId);

      console.log('API Response:', res.data);
      const warehouse = res.data.data;

      setWarehouses(warehouse ? [warehouse] : []);
    } catch {
      toast.error('فشل في جلب المستودعات');
    }
  };

  useEffect(() => {
    loadWarehouses();
  }, [branchId]);

  return (
    <div className="p-6 max-w-4xl mx-auto" dir="rtl">
      <h2 className="text-2xl font-bold mb-4">قائمة المستودعات</h2>
      {warehouses.length === 0 ? (
        <p className="text-gray-500">لا توجد مستودعات</p>
      ) : (
        <table className="w-full table-auto border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">الاسم</th>
              <th className="p-3 border">الموقع</th>
              <th className="p-3 border">تفاصيل</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((warehouse) => (
              <tr key={warehouse.id} className="hover:bg-gray-50">
                <td className="p-3 border">{warehouse.name}</td>
                <td className="p-3 border">{warehouse.location}</td>
                <td className="p-3 border text-center">
                  <button
                    onClick={() => navigate(`/branches/${branchId}/warehouse/${warehouse.id}`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    عرض التفاصيل
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WarehousesPage;
