import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import TableModal from "../../components/TableModal";
import { getBranchId } from "../../utils/api";
import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
} from "../../services/tableService";

const TablePage = () => {
  const branchId = getBranchId();
  console.log("branchId =", branchId);

  const [tables, setTables] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    table_number: "",
    chair_number: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTables = () => {
    console.log("branchId 2 =", branchId);
    getTables(branchId)
      .then((data) => {
        if (data.total>0) {
          console.log("total:"+data.total);
           console.log("data:"+data.data);
            console.log("tables data:", data.data);

            const invalidTables = data.data.filter(t => !t.id || isNaN(Number(t.id)));
            console.log("🚨 طاولات فيها مشكلة بالـ id:", invalidTables);

          setTables(data.data);
        } else {
          console.error("فشل في جلب الطاولات:", data.message);
        }
      })
      .catch((err) => console.error("خطأ في جلب الطاولات:", err));
  };

  useEffect(() => {
    if (branchId){
      console.log("fetchTables branchId:"+branchId);
      fetchTables();
    } 
  }, [branchId]);

  const openModal = (table = null) => {
    setFormData(
      table || { id: "", table_number: "", chair_number: "" }
    );
    setIsModalOpen(true);
  };

  const handleAddTable = async (e) => {
    e.preventDefault();
    const maxTableNumber = Math.max(
      0,
      ...tables.map((t) => Number(t.table_number))
    );

    const newTable = {
      table_number: maxTableNumber + 1,
      chair_number: formData.chair_number,
      branch_id: Number(branchId),
    };

    const data = await createTable(newTable);
    if (data.success) {
      fetchTables();
      setIsModalOpen(false);
    } else {
      console.error("فشل في الإضافة:", data.message);
    }
  };

  const handleUpdateTable = async (e) => {
    e.preventDefault();
    const updated = {
      table_number: formData.table_number,
      chair_number: formData.chair_number,
      branch_id: Number(branchId),
    };

    const data = await updateTable(formData.id, updated);
    if (data.success) {
      fetchTables();
      setIsModalOpen(false);
    } else {
      console.error("فشل في التحديث:", data.message);
    }
  };

  const handleDeleteTable = async (id) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;
    const data = await deleteTable(id);
    if (data.success) {
      fetchTables();
    } else {
      console.error("فشل في الحذف:", data.message);
    }
  };

  return (
    <div dir="rtl" className="p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-red-700">طاولات الفرع</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 hover:scale-105 text-white px-5 py-2 rounded-full shadow-lg"
        >
          <Plus size={20} /> إضافة طاولة
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tables.map((table) => (
          <div
            key={table.id}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer flex flex-col items-center"
          >
            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 select-none">
              {table.table_number}
            </div>
            <p className="text-gray-700 font-semibold mb-4">
              عدد الكراسي: {table.chair_number}
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => openModal(table)}
                className="text-green-600 hover:text-green-800"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={() => handleDeleteTable(table.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <TableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={formData.id ? handleUpdateTable : handleAddTable}
        title={formData.id ? "تعديل طاولة" : "إضافة طاولة جديدة"}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default TablePage;
