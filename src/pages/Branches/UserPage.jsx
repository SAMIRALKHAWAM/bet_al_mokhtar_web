import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEmployees,createEmployee,deleteEmployee,updateEmployee } from '../../services/usersService';

const initialUser = {
  name: '',
  type: '',
  phone: '',
  address: '',
  age: '',
  skill: '',
  last_job: '',
};

const UserPage = () => {
  const { id: branchId } = useParams();
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newUser, setNewUser] = useState(initialUser);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchUsers = () => {
    getEmployees().then((data) => {
      if (data.success) {
        const filtered = data.data.filter((u) => u.branch_id == branchId);
        setUsers(filtered);
      }
    });
  };

  useEffect(() => {
    fetchUsers();
  }, [branchId]);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const action = editMode
      ? () => updateEmployee(editId, { ...newUser, branch_id: branchId })
      : () => createEmployee({ ...newUser, branch_id: branchId });

    const data = await action();
    if (data.success) {
      fetchUsers();
      closeModal();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل تريد حذف هذا الموظف؟')) return;

    const data = await deleteEmployee(id);
    if (data.success) {
      fetchUsers();
    }
  };

  const openEditModal = (user) => {
    setNewUser(user);
    setEditId(user.id);
    setEditMode(true);
    setModalOpen(true);
  };

  const openAddModal = () => {
    setNewUser(initialUser);
    setEditMode(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setNewUser(initialUser);
    setEditMode(false);
    setEditId(null);
  };

  return (
    <div className="p-10 space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-red-700">موظفو الفرع رقم {branchId}</h2>
        <button
          onClick={openAddModal}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
        >
          + إضافة موظف
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white shadow rounded-xl p-4 text-black space-y-1">
            <p><strong>الاسم:</strong> {user.name}</p>
            <p><strong>النوع:</strong> {user.type}</p>
            <p><strong>الهاتف:</strong> {user.phone}</p>
            <p><strong>العنوان:</strong> {user.address}</p>
            <p><strong>العمر:</strong> {user.age}</p>
            <p><strong>المهارة:</strong> {user.skill}</p>
            <p><strong>الوظيفة السابقة:</strong> {user.last_job}</p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => openEditModal(user)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                تعديل
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-[90%] md:w-[500px] p-6 rounded-xl shadow-xl text-black space-y-4"
          >
            <h3 className="text-2xl font-semibold text-center">
              {editMode ? 'تعديل موظف' : 'إضافة موظف جديد'}
            </h3>
            {Object.entries(newUser).map(([key, value]) => (
              <input
                key={key}
                name={key}
                value={value}
                onChange={handleChange}
                placeholder={key}
                className="border w-full p-2 rounded"
              />
            ))}
            <div className="flex justify-between mt-4">
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                {editMode ? 'تحديث' : 'إضافة'}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserPage;
