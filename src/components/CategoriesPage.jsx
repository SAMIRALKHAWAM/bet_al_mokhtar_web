import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ id: '', name: '', image: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const navigate = useNavigate();

  const fetchCategories = () => {
    fetch('http://192.168.17.1:8000/api/admin/get_categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.data))
      .catch((error) => console.error('Error fetching categories:', error));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setFormData({ id: '', name: '', image: null });
    setModalType('add');
    setIsModalOpen(true);
  };

  const openEditModal = async (category) => {
    const res = await fetch(`http://192.168.17.1:8000/api/admin/get_one_category/${category.id}`);
    const data = await res.json();
    setFormData({ id: data.data.id, name: data.data.name, image: null });
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    if (formData.image) data.append('image', formData.image);

    const url =
      modalType === 'add'
        ? 'http://192.168.17.1:8000/api/admin/create_category'
        : `http://192.168.17.1:8000/api/admin/update_one_category/${formData.id}`;

    fetch(url, {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then(() => {
        fetchCategories();
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.error('Error submitting category:', err);
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('هل تريد حذف هذا القسم؟')) return;

    fetch(`http://192.168.17.1:8000/api/admin/delete_one_category/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => fetchCategories());
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-red-700">الأقسام</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 hover:scale-105 transform px-5 py-2 text-white rounded-full shadow-lg"
        >
          <Plus size={20} />
          إضافة قسم
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 cursor-pointer"
            onClick={() => navigate(`/categories/${cat.id}`)}
          >
            <img
              src={`http://192.168.17.1:8000/storage/${cat.image}`}
              alt={cat.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-5">
              <h2 className="text-2xl font-bold mb-2 text-red-700">{cat.name}</h2>
              <div className="flex gap-4">
                <button
                  className="text-green-600 hover:text-green-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(cat);
                  }}
                >
                  <Pencil size={20} />
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(cat.id);
                  }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          title={modalType === 'add' ? 'إضافة قسم جديد' : 'تعديل القسم'}
          fields={[{ name: 'name', label: 'اسم القسم' }]}
          formData={formData}
          setFormData={setFormData}
        >
          <div className="mb-4">
            <label className="block mb-1 font-semibold">صورة القسم</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CategoriesPage;
