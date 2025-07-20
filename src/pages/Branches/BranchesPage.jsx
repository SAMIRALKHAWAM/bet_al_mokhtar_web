import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BranchModal from '../../components/BranchModal.jsx'
import { fetchBranches,createBranch,updateBranch,deleteBranch} from '../../services/branchService'
  

const BranchesPage = () => {
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({ id: '', name: '', location: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectPageModalOpen, setIsSelectPageModalOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const navigate = useNavigate();

  const loadBranches = () => {
    fetchBranches()
      .then(setBranches)
      .catch(err => console.error('فشل في جلب البيانات:', err));
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const openModal = () => {
    setFormData({ id: '', name: '', location: '' });
    setIsModalOpen(true);
  };

  const handleEditBranch = (id) => {
    const branch = branches.find(b => b.id === id);
    if (branch) {
      setFormData(branch);
      setIsModalOpen(true);
    }
  };

  const handleBranchClick = (branchId) => {
    setSelectedBranchId(branchId);
    setIsSelectPageModalOpen(true);
  };

  const handlePageSelect = (page) => {
  setIsSelectPageModalOpen(false);
  if (page === 'tables') navigate(`/branches/${selectedBranchId}/table`);
  else if (page === 'employees') navigate(`/branches/${selectedBranchId}/user`);
  else if (page === 'invoice') navigate(`/branches/${selectedBranchId}/invoice`);
  else if (page === 'rate') navigate(`/branches/${selectedBranchId}/rate`);
  else if (page === 'warehouse') navigate(`/branches/${selectedBranchId}/warehouse`);
};

  const handleAddBranch = (e) => {
    e.preventDefault();
    createBranch(formData)
      .then(() => {
        loadBranches();
        setIsModalOpen(false);
      })
      .catch(err => console.error('فشل في الإضافة:', err));
  };

  const handleUpdateBranch = (e) => {
    e.preventDefault();
    updateBranch(formData.id, formData)
      .then(() => {
        loadBranches();
        setIsModalOpen(false);
      })
      .catch(err => console.error('فشل في التحديث:', err));
  };

  const handleDeleteBranch = (id) => {
    if (!window.confirm('هل أنت متأكد من حذف الفرع؟')) return;
    deleteBranch(id)
      .then(() => loadBranches())
      .catch(err => console.error('فشل في الحذف:', err));
  };

  return (
    <div dir="rtl"className="p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-red-700">الفروع</h1>
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 hover:scale-105 text-white px-5 py-2 rounded-full shadow-lg"
        >
          <Plus size={20} />
          إضافة فرع
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map(branch => (
          <div
            key={branch.id}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
            onClick={() => handleBranchClick(branch.id)}
          >
            <h2 className="text-2xl font-bold text-red-700 mb-2">{branch.name}</h2>
            <p className="text-gray-600 mb-1">📍 {branch.location}</p>

            <div className="flex gap-4 mt-4">
              <button
                className="text-green-600 hover:text-green-800"
                onClick={e => {
                  e.stopPropagation();
                  handleEditBranch(branch.id);
                }}
              >
                <Pencil size={20} />
              </button>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={e => {
                  e.stopPropagation();
                  handleDeleteBranch(branch.id);
                }}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isSelectPageModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsSelectPageModalOpen(false)}
            >
              <X size={20} />
            </button>
            <button
              onClick={() => handlePageSelect('tables')}
              className="block w-full mb-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
            >
              صفحة الطاولات
            </button>
            <button
              onClick={() => handlePageSelect('employees')}
              className="block w-full mb-3 py-2 rounded bg-orange-500 text-white hover:bg-orange-600 transition"
            >
              صفحة الموظفين
            </button>
            <button
              onClick={() => handlePageSelect('invoice')}
              className="block w-full mb-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
            >
              صفحة الفواتير
            </button>
            <button
              onClick={() => handlePageSelect('rate')}
              className="block w-full py-2 rounded bg-orange-500 text-white hover:bg-orange-600 transition"
            >
              صفحة التقييم
            </button>
            <button
              onClick={() => handlePageSelect('warehouse')}
              className="block w-full mb-3 mt-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
            >
              صفحة المستودع
            </button>
          </div>
        </div>
      )}

      <BranchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={formData.id ? handleUpdateBranch : handleAddBranch}
        title={formData.id ? 'تعديل فرع' : 'إضافة فرع جديد'}
        fields={[
          { name: 'name', label: 'اسم الفرع' },
          { name: 'location', label: 'مكان الفرع' },
        ]}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default BranchesPage;
