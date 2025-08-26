import React, { useEffect, useState } from "react";
import MaterialRow from "../../components/MaterialRow";
import {
  fetchMaterialsByBranch,
  addWarehouseMaterialQuantity,
  removeWarehouseMaterialQuantity,
} from "../../services/WarehouseManger/warehouseServices";

export default function WarehouseManagerPage() {
  const [materials, setMaterials] = useState([]);
  const [branchId, setBranchId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.branchId) {
      setBranchId(user.branchId);
    }
  }, []);

  useEffect(() => {
    if (branchId) loadMaterials(branchId);
  }, [branchId]);

  const loadMaterials = async (branchId) => {
  setLoading(true);
  try {
    const res = await fetchMaterialsByBranch(branchId);
    if (res.success) {
    
      const mergedMap = new Map();
      res.data.forEach((item) => {
        const key = item.material_id;
        if (mergedMap.has(key)) {
          const existing = mergedMap.get(key);
          existing.quantity += item.quantity ?? 0;
        } else {
          mergedMap.set(key, {
            ...item,
            name: item.name || `مادة ${item.material_id}`,
            quantity: item.quantity ?? 0,
            addQty: 0,
            removeQty: 0,
          });
        }
      });

      const formatted = Array.from(mergedMap.values());
      setMaterials(formatted);
      setError("");
    } else {
      setMaterials([]);
      setError("لا يوجد مواد في هذا المستودع.");
    }
  } catch (err) {
    setError("فشل تحميل المواد: " + err.message);
  }
  setLoading(false);
};


  const handleInputChange = (materialId, field, value) => {
    setMaterials((prevMaterials) =>
      prevMaterials.map((mat) =>
        mat.material_id === materialId
          ? { ...mat, [field]: Number(value) || 0 }
          : mat
      )
    );
  };

  const handleAddAll = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const toAdd = materials
      .filter((m) => m.addQty && m.addQty > 0)
      .map((m) => ({
        material_id: m.material_id,
        quantity: m.addQty,
      }));

    if (toAdd.length === 0) return alert("لم تدخل أي كمية للإدخال.");

    try {
      await addWarehouseMaterialQuantity({
        warehouseman_id: user.id,
        branch_id: user.branchId,
        materials: toAdd,
      });
      alert("تم تنفيذ الإدخال بنجاح.");
      await loadMaterials(branchId);
    } catch (err) {
      alert("فشل في تنفيذ الإدخال: " + err.message);
    }
  };

  const handleRemoveAll = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const toRemove = [];

    for (const m of materials) {
      if (m.removeQty && m.removeQty > 0) {
        if (m.removeQty > m.quantity) {
          return alert(`لا يمكن إخراج أكثر من المتوفر للمادة: ${m.name}`);
        }
        toRemove.push({
          material_id: m.material_id,
          quantity: m.removeQty,
        });
      }
    }

    if (toRemove.length === 0) return alert("لم تدخل أي كمية للإخراج.");

    try {
      await removeWarehouseMaterialQuantity({
        warehouseman_id: user.id,
        branch_id: user.branchId,
        materials: toRemove,
      });
      alert("تم تنفيذ الإخراج بنجاح.");
      await loadMaterials(branchId);
    } catch (err) {
      alert("فشل في تنفيذ الإخراج: " + err.message);
    }
  };

  if (loading) return <p className="text-center">جاري تحميل المواد...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div dir="rtl" className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl mb-6 font-bold text-center">إدارة المستودع</h1>

      <table className="w-full table-auto border border-gray-300 mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">المادة</th>
            <th className="border p-2">الكمية الحالية</th>
            <th className="border p-2">كمية للإدخال</th>
            <th className="border p-2">كمية للإخراج</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <MaterialRow
              key={material.material_id}
              material={material}
              onQtyChange={handleInputChange}
            />
          ))}
        </tbody>
      </table>

      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={handleAddAll}
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
        >
          تنفيذ إدخال
        </button>
        <button
          onClick={handleRemoveAll}
          className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
        >
          تنفيذ إخراج
        </button>
      </div>
    </div>
  );
}
