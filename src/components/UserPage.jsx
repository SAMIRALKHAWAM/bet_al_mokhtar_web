import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const UserPage = () => {
  const { id: branchId } = useParams(); // ← جلب branch_id من الرابط
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    phone: '',
    address: '',
    age: '',
    skill: '',
    type: '',
    last_job: '',
  });

  useEffect(() => {
    fetch(`http://192.168.17.1:8000/api/admin/get_employees`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // تصفية الموظفين حسب الفرع المحدد
          const filtered = data.data.filter((user) => user.branch_id == branchId);
          setUsers(filtered);
        }
      })
      .catch((error) => console.error('فشل في جلب الموظفين:', error));
  }, [branchId]);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = (e) => {
    e.preventDefault();

    const body = {
      ...newUser,
      branch_id: branchId, // ← ربط الموظف بالفرع تلقائياً
    };

    fetch('http://192.168.17.1:8000/api/create_employee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers((prev) => [...prev, data.data]);
          setNewUser({
            name: '',
            phone: '',
            address: '',
            age: '',
            skill: '',
            type: '',
            last_job: '',
          });
        }
      })
      .catch((err) => console.error('فشل في الإضافة:', err));
  };

  const handleDelete = (id) => {
    if (!window.confirm('هل تريد حذف هذا الموظف؟')) return;

    fetch(`http://192.168.17.1:8000/api/delete_one_employee/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers((prev) => prev.filter((user) => user.id !== id));
        }
      })
      .catch((err) => console.error('خطأ في الحذف:', err));
  };

  return (
    <div className="p-10 space-y-10">
      <h2 className="text-3xl font-bold text-red-700">الموظفون في الفرع رقم {branchId}</h2>

      <form onSubmit={handleAddUser} className="bg-white p-6 rounded-xl shadow grid grid-cols-2 gap-4 text-black">
        <h3 className="text-xl font-semibold col-span-2">إضافة موظف جديد</h3>
        <input name="name" value={newUser.name} onChange={handleChange} placeholder="الاسم" className="border p-2 rounded" required />
        <input name="phone" value={newUser.phone} onChange={handleChange} placeholder="رقم الهاتف" className="border p-2 rounded" required />
        <input name="address" value={newUser.address} onChange={handleChange} placeholder="العنوان" className="border p-2 rounded" />
        <input name="age" value={newUser.age} onChange={handleChange} placeholder="العمر" className="border p-2 rounded" />
        <input name="skill" value={newUser.skill} onChange={handleChange} placeholder="المهارة" className="border p-2 rounded" />
        <input name="type" value={newUser.type} onChange={handleChange} placeholder="النوع" className="border p-2 rounded" />
        <input name="last_job" value={newUser.last_job} onChange={handleChange} placeholder="الوظيفة السابقة" className="border p-2 rounded" />
        <button type="submit" className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700">
          إضافة الموظف
        </button>
      </form>

      <div className="grid md:grid-cols-2 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-xl shadow text-black">
            <p><strong>الاسم:</strong> {user.name}</p>
            <p><strong>الهاتف:</strong> {user.phone}</p>
            <p><strong>العنوان:</strong> {user.address}</p>
            <p><strong>العمر:</strong> {user.age}</p>
            <p><strong>المهارة:</strong> {user.skill}</p>
            <p><strong>النوع:</strong> {user.type}</p>
            <p><strong>الوظيفة السابقة:</strong> {user.last_job}</p>
            <button onClick={() => handleDelete(user.id)} className="mt-2 bg-red-600 text-white py-1 rounded hover:bg-red-700">
              حذف
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPage;
