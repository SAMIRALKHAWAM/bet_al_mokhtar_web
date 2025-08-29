import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchMaterials,createMaterial,deleteMaterial,updateMaterial } from "../services/warehouseMaterialServices";

export default function WarehouseMaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newMaterial, setNewMaterial] = useState({ name: "", unit: "", price: "" });
  const [editingMaterial, setEditingMaterial] = useState(null);

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const data = await fetchMaterials();
      setMaterials(data);
    } catch (err) {
      toast.error(err.message || "فشل تحميل المواد");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleCreateOrUpdate = async () => {
    try {
      if (editingMaterial) {
        await updateMaterial(editingMaterial.id, newMaterial);
        toast.success("تم تعديل المادة بنجاح");
      } else {
        await createMaterial(newMaterial);
        toast.success("تم إنشاء المادة بنجاح");
      }
      setNewMaterial({ name: "", unit: "", price: "" });
      setEditingMaterial(null);
      loadMaterials();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setNewMaterial({ name: material.name, unit: material.unit, price: material.price });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف المادة؟")) return;
    try {
      await deleteMaterial(id);
      toast.success("تم حذف المادة");
      setMaterials((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div dir="rtl" className="p-6 max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6">🛠 إدارة المواد</h1>

     
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded shadow space-y-2">
        <h2 className="text-xl font-bold">{editingMaterial ? "تعديل المادة" : "إضافة مادة جديدة"}</h2>
        <input
          className="border p-2 rounded w-full"
          placeholder="اسم المادة"
          value={newMaterial.name}
          onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="الوحدة"
          value={newMaterial.unit}
          onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
        />
        <input
          type="number"
          className="border p-2 rounded w-full"
          placeholder="السعر"
          value={newMaterial.price}
          onChange={(e) => setNewMaterial({ ...newMaterial, price: e.target.value })}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleCreateOrUpdate}
        >
          {editingMaterial ? "تحديث المادة" : "إضافة المادة"}
        </button>
        {editingMaterial && (
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded ml-2"
            onClick={() => {
              setEditingMaterial(null);
              setNewMaterial({ name: "", unit: "", price: "" });
            }}
          >
            إلغاء
          </button>
        )}
      </div>

      {/* جدول المواد */}
      {loading ? (
        <p>جاري التحميل...</p>
      ) : materials.length === 0 ? (
        <p>لا توجد مواد حالياً.</p>
      ) : (
        <table className="w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">الاسم</th>
              <th className="border p-2">الوحدة</th>
              <th className="border p-2">السعر</th>
              <th className="border p-2">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((m, idx) => (
              <tr key={m.id} className="text-center">
                <td className="border p-2">{idx + 1}</td>
                <td className="border p-2">{m.name}</td>
                <td className="border p-2">{m.unit}</td>
                <td className="border p-2">{m.price}</td>
                <td className="border p-2 flex justify-center gap-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => handleEdit(m)}
                  >
                    تعديل
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(m.id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
