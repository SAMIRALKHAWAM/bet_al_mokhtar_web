import React, { useState, useEffect } from 'react';

const ItemModal = ({ isOpen, onClose, onSave, item, modalType }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    images: [],
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        images: [], 
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: Array.from(e.target.files),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {modalType === 'edit' ? 'تعديل عنصر' : 'إضافة عنصر جديد'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">الاسم</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
        
          <div className="mb-4">
            <label className="block mb-1 font-medium">السعر</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
           <div className="mb-4">
            <label className="block mb-1 font-medium">الوصف</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
             <div className="mb-4">
              <label className="block mb-1 font-medium">الصور</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

          {modalType === 'add' && (
            <div>
              {/* <div className="mb-4">
              <label className="block mb-1 font-medium">الصور</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="w-full border rounded px-3 py-2"
              />
            </div> */}

           
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemModal;
