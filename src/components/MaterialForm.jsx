import React, { useEffect, useState } from 'react';
import{
  createMaterial,
  fetchBranches,
  updateMaterial,
  fetchWarehouses,
  getMaterials,
  handleWarehouseAction
} from '../services/WarehouseManger/warehouseServices'
export default function MaterialsManager() {
  const [branches, setBranches] = useState([]);
  const [materialsList, setMaterialsList] = useState([]);
  const [newMaterial, setNewMaterial] = useState({ name: '', unit: '', price: '' });
  const [warehouseData, setWarehouseData] = useState({
    branch_id: '',
    warehouseman_id: '',
    materials: [{ material_id: '', quantity: '' }],
  });

  useEffect(() => {
    const init = async () => {
      const branchRes = await fetchBranches();
      setBranches(branchRes.data.data);
      const matRes = await getMaterials();
      setMaterialsList(matRes.data.data);
    };
    init();
  }, []);

  const handleAddMaterial = async () => {
    await createMaterial(newMaterial);
    setNewMaterial({ name: '', unit: '', price: '' });
    const updated = await getMaterials();
    setMaterialsList(updated.data.data);
  };

  const handleDelete = async (id) => {
    await deleteMaterial(id);
    const updated = await getMaterials();
    setMaterialsList(updated.data.data);
  };

  const handleBranchChange = async (e) => {
    const branch_id = e.target.value;
    setWarehouseData({ ...warehouseData, branch_id });
    const res  = await fetchWarehouses(branch_id);
    const { warehouseman_id } = res.data.data;
    setWarehouseData((prev) => ({ ...prev, warehouseman_id }));
  };

  const handleAction = async (type) => {
    await handleWarehouseAction(type, warehouseData);
    alert('تمت العملية بنجاح');
  };

  return (
    <div className="space-y-6">
      {/* إضافة مادة جديدة */}
      <div className="bg-white shadow-md p-4 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">إضافة مادة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" className="border p-2 rounded" placeholder="اسم المادة"
            value={newMaterial.name} onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })} />
          <input type="text" className="border p-2 rounded" placeholder="الوحدة"
            value={newMaterial.unit} onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })} />
          <input type="number" className="border p-2 rounded" placeholder="السعر"
            value={newMaterial.price} onChange={(e) => setNewMaterial({ ...newMaterial, price: e.target.value })} />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleAddMaterial}>
          إضافة
        </button>
      </div>

      {/* قائمة المواد */}
      <div className="bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">المواد</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {materialsList.map((mat) => (
            <div key={mat.id} className="border p-3 rounded bg-gray-50">
              <p><strong>الاسم:</strong> {mat.name}</p>
              <p><strong>الوحدة:</strong> {mat.unit}</p>
              <p><strong>السعر:</strong> {mat.price}</p>
              <button className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => handleDelete(mat.id)}>حذف</button>
            </div>
          ))}
        </div>
      </div>

      {/* إدخال المواد */}
      <div className="bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">إدخال مواد</h2>

        {/* اختيار الفرع */}
        <select className="border p-2 rounded w-full mb-4" onChange={handleBranchChange} value={warehouseData.branch_id}>
          <option value="">اختر الفرع</option>
          {branches.map(branch => (
            <option key={branch.id} value={branch.id}>{branch.name}</option>
          ))}
        </select>

        {/* اختيار المواد */}
        {warehouseData.materials.map((mat, idx) => (
          <div key={idx} className=" md:grid-cols-4 gap-4 mb-2">
            <select className="border p-2 rounded" value={mat.material_id} onChange={(e) => {
              const copy = [...warehouseData.materials];
              copy[idx].material_id = e.target.value;
              setWarehouseData({ ...warehouseData, materials: copy });
            }}>
              <option value="">اختر مادة</option>
              {materialsList.map((material) => (
                <option key={material.id} value={material.id}>{material.name}</option>
              ))}
            </select>

            <input type="number" className="border p-2 rounded" placeholder="الكمية"
              value={mat.quantity} onChange={(e) => {
                const copy = [...warehouseData.materials];
                copy[idx].quantity = e.target.value;
                setWarehouseData({ ...warehouseData, materials: copy });
              }} />
          </div>
        ))}

        <button className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
          onClick={() => setWarehouseData(prev => ({ ...prev, materials: [...prev.materials, { material_id: '', quantity: '' }] }))}>
          + إضافة مادة أخرى
        </button>

        <div className="flex gap-4 mt-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => handleAction('add')}>
            إدخال المواد
          </button>
        </div>
      </div>
    </div>
  );
}