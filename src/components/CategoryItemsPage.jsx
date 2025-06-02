import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Pencil, Trash2, Plus, Trash } from 'lucide-react';
import ItemModal from './ItemModel';

const CategoryItemsPage = () => {
  const { id: categoryId } = useParams();
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentItem, setCurrentItem] = useState(null);

  const fetchItems = () => {
    fetch(`http://192.168.17.1:8000/api/admin/get_items?categoryId=${categoryId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setItems(data.data);
        }
      })
      .catch((err) => console.error('Fetch error:', err));
  };

  useEffect(() => {
    fetchItems();
  }, [categoryId]);

  const openAddModal = () => {
    setCurrentItem(null);
    setModalType('add');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setCurrentItem(item);
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleSaveItem = (formData) => {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category_id', categoryId);

    formData.images.forEach((img, i) => {
      data.append(`images[${i}]`, img);
    });

    const url = modalType === 'add'
      ? 'http://192.168.17.1:8000/api/admin/create_item'
      : `http://192.168.17.1:8000/api/admin/update_one_item/${currentItem.id}`;

    fetch(url, {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          fetchItems();
          setIsModalOpen(false);
        } else {
          alert('حدث خطأ في العملية');
          console.error('API error:', data);
        }
      })
      .catch((err) => {
        alert('حدث خطأ في الاتصال بالخادم');
        console.error('Submit error:', err);
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('هل تريد حذف هذه الوجبة؟')) return;
    fetch(`http://192.168.17.1:8000/api/admin/delete_one_item/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => fetchItems());
  };

  const handleDeleteImage = (itemId, imageId) => {
    const formData = new FormData();
    formData.append('images[0]', imageId);

    fetch(`http://192.168.17.1:8000/api/admin/delete_item_images/${itemId}`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) fetchItems();
      })
      .catch((err) => console.error('Delete image error:', err));
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold text-red-700 mb-8 text-center">إدارة الوجبات</h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={openAddModal}
          className="bg-gradient-to-r from-red-600 to-orange-500 hover:scale-105 text-white px-5 py-2 rounded-full shadow-lg flex items-center gap-2"
        >
          <Plus size={20} />
          إضافة وجبة
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-500">لا يوجد وجبات في هذا القسم.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold text-red-700 mb-2">{item.name}</h2>
              <p className="text-gray-600 mb-2">السعر: {item.price} د.أ</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {item.item_images?.map((img) => (
                  <div key={img.id} className="relative w-32 h-32">
                   <img
                   src={img.image}
                   alt="صورة الوجبة"
                  className="w-full h-full object-cover rounded"
                  />
                    <button
                      onClick={() => handleDeleteImage(item.id, img.id)}
                      className="absolute top-0 right-0 text-red-600 bg-white rounded-full p-1 shadow"
                      title="حذف الصورة"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  className="text-green-600 hover:text-green-800"
                  onClick={() => openEditModal(item)}
                >
                  <Pencil size={20} />
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ItemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveItem}
          item={currentItem || {}}
        />
      )}
    </div>
  );
};

export default CategoryItemsPage;