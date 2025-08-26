import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  getEmployees,
  createEmployee,
  deleteEmployee,
  updateEmployee
} from '../../services/usersService';

const initialUser = {
  name: '',
  user_name: '',
  password: '',
  type: '',
  phone: '',
  address: '',
  age: '',
  skill: '',
  last_job: '',
};

const fieldLabels = {
  name: 'الاسم',
  user_name: 'اسم المستخدم',
  password: 'كلمة السر',
  type: 'الوظيفة',
  phone: 'رقم الهاتف',
  address: 'العنوان',
  age: 'العمر',
  skill: 'المهارة',
  last_job: 'الوظيفة السابقة',
};

const UserPage = () => {
  const { branchId: branchIdFromParams } = useParams();
  const type = localStorage.getItem('type');
  const localBranchId = localStorage.getItem('branch_id');

  const branchId = type === 'subadmin' ? localBranchId : branchIdFromParams;

  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newUser, setNewUser] = useState(initialUser);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchUsers = () => {
    console.log("fetch");
    getEmployees().then((data) => {
      if (data.success) {
        const filtered = data.data.filter((u) => String(u.branch_id) === String(branchId));
        setUsers(filtered);
      } else {
        toast.error("فشل في جلب الموظفين");
      }
    }).catch(() => {
      toast.error("خطأ في الاتصال بالسيرفر");
    });
  };

  useEffect(() => {
    console.log("branchId : : "+branchId);
    if (branchId) fetchUsers();
  }, [branchId]);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!branchId) {
    toast.error("رقم الفرع غير موجود، الرجاء إعادة المحاولة.");
    return;
  }

  const payload = { ...newUser, branch_id: branchId };
  console.log("🔍 Payload to send:", payload);

  const data = editMode
    ? await updateEmployee(editId, payload)
    : await createEmployee(payload);

  if (!data.success) {
    toast.error("فشل إرسال البيانات. تحقق من الحقول المدخلة.");
    console.error("🛑 خطأ من السيرفر:", data);
    return;
  }

  fetchUsers();
  closeModal();
  toast.success(editMode ? "تم التحديث بنجاح" : "تمت الإضافة بنجاح");
};


  const handleDelete = async (id) => {
    if (!window.confirm('هل تريد حذف هذا الموظف؟')) return;
    const data = await deleteEmployee(id);
    if (data.success) {
      fetchUsers();
      toast.success("تم الحذف بنجاح");
    } else {
      toast.error("فشل في حذف الموظف");
    }
  };

  const openEditModal = (user) => {
    const { id, branch_id, branch_name, ...rest } = user;
    setNewUser(rest);
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
    <div dir="rtl" className="p-10 space-y-10" >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-red-700">
          موظفو الفرع 
        </h2>
        <button
          onClick={openAddModal}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:scale-105 text-white px-4 py-2 rounded-lg shadow"
        >
          + إضافة موظف
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white shadow rounded-xl p-4 text-black space-y-1 text-right">
            <p><strong>الاسم:</strong> {user.name}</p>
            <p><strong>اسم المستخدم:</strong> {user.user_name}</p>
            <p><strong>كلمة السر:</strong> {user.password}</p>
            <p><strong>الوظيفة:</strong> {user.type}</p>
            <p><strong>رقم الهاتف:</strong> {user.phone}</p>
            <p><strong>العنوان:</strong> {user.address}</p>
            <p><strong>العمر:</strong> {user.age}</p>
            <p><strong>المهارة:</strong> {user.skill}</p>
            <p><strong>الوظيفة السابقة:</strong> {user.last_job}</p>

            <div className="flex gap-2 mt-3 justify-end">
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" dir="rtl">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-[90%] md:w-[500px] p-4 rounded-xl shadow-xl text-black space-y-1 text-right"
          >
            <h3 className="text-2xl font-semibold text-center">
              {editMode ? 'تعديل موظف' : 'إضافة موظف جديد'}
            </h3>

            {Object.entries(newUser).map(([key, value]) => {
              if (key === 'type') {
                return (
                  <div key={key} className="mb-1">
                    <label className="block mb-1 font-medium">{fieldLabels[key]}</label>
                    <select
                      name={key}
                      value={value}
                      onChange={handleChange}
                      className="border w-full p-2 rounded text-right bg-white"
                    >
                      <option value="">اختر الوظيفة</option>
                      <option value="cashier">كاشير </option>
                      <option value="accountant">محاسب</option>
                      <option value="waiter">نادل</option>
                      <option value="captain">كابتن </option>
                      <option value="warehouseman">أمين مستودع</option>
                      <option value="deliveryman">موصل طلبات</option>
                    </select>
                  </div>
                );
              }

              return (
                <div key={key} className="mb-1">
                  <label className="block mb-1 font-medium">{fieldLabels[key]}</label>
                  <input
                    type={key === 'age' ? 'number' : 'text'}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    placeholder={`أدخل ${fieldLabels[key]}`}
                    className="border w-full p-2 rounded text-right placeholder:text-gray-400"
                  />
                </div>
              );
            })}

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
