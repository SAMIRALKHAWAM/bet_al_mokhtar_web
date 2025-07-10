import React from 'react';

const BranchModal = ({ isOpen, onClose, onSubmit, title, formData, setFormData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-red-700">{title}</h2>

        <form onSubmit={onSubmit} className="space-y-4">
         
          <div>
            <label className="block mb-1 font-medium">اسم الفرع</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-red-500"
            />
          </div>

        
          <div>
            <label className="block mb-1 font-medium">مكان الفرع</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-red-500"
            />
          </div>

        
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchModal;
