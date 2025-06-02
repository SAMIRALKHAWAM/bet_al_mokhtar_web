import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import TableModal from './TableModal';

const TablesPage = () => {
  const { branchId } = useParams();
  const [tables, setTables] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    table_number: '',
    chair_number: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTables = () => {
    fetch(`http://192.168.17.1:8000/api/admin/get_tables`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const filteredTables = data.data.filter(table => String(table.branch_id) === String(branchId));
          setTables(filteredTables);
        } else {
          console.error('فشل في جلب الطاولات:', data.message);
        }
      })
      .catch((error) => {
        console.error('خطأ في جلب الطاولات:', error);
      });
  };

  useEffect(() => {
    fetchTables();
  }, [branchId]);

  const openModal = (table = null) => {
    if (table) {
      setFormData(table);
    } else {
      setFormData({ id: '', table_number: '', chair_number: '' });
    }
    setIsModalOpen(true);
  };

 const handleAddTable = (e) => {
  e.preventDefault();

  // احسب أعلى رقم طاولة موجود + 1
  const maxTableNumber = Math.max(0, ...tables.map(t => Number(t.table_number)));
  const newTableNumber = maxTableNumber + 1;

  fetch('http://192.168.17.1:8000/api/admin/create_table', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      table_number: newTableNumber,
      chair_number: formData.chair_number,
      branch_id: branchId,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        fetchTables();
        setIsModalOpen(false);
      } else {
        console.error('فشل في إضافة الطاولة:', data.message);
      }
    })
    .catch((error) => {
      console.error('خطأ أثناء الإضافة:', error);
    });
};


  const handleUpdateTable = (e) => {
    e.preventDefault();

    fetch(`http://192.168.17.1:8000/api/admin/update_one_table/${formData.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        table_number: formData.table_number,
        chair_number: formData.chair_number,
        branch_id: branchId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          fetchTables();
          setIsModalOpen(false);
        } else {
          console.error('فشل في تحديث الطاولة:', data.message);
        }
      })
      .catch((error) => {
        console.error('خطأ أثناء التحديث:', error);
      });
  };

  const handleDeleteTable = (id) => {
    if (!window.confirm('هل أنت متأكد من حذف الطاولة؟')) return;

    fetch(`http://192.168.17.1:8000/api/admin/delete_one_table/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          fetchTables();
        } else {
          console.error('فشل في حذف الطاولة:', data.message);
        }
      })
      .catch((error) => {
        console.error('خطأ أثناء الحذف:', error);
      });
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-red-700">طاولات الفرع</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 hover:scale-105 text-white px-5 py-2 rounded-full shadow-lg"
        >
          <Plus size={20} />
          إضافة طاولة
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
            <p className="text-gray-700 font-semibold mb-4">عدد الكراسي: {table.chair_number}</p>

            <div className="flex gap-4">
              <button
                className="text-green-600 hover:text-green-800"
                onClick={() => openModal(table)}
              >
                <Pencil size={20} />
              </button>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => handleDeleteTable(table.id)}
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
        title={formData.id ? 'تعديل طاولة' : 'إضافة طاولة جديدة'}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default TablesPage;
