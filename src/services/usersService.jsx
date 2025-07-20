import { BASE_URL } from "../utils/api";

export const getEmployees = async () => {
  try {
    const res = await fetch(`${BASE_URL}/get_employees`);
    console.log("Response status:", res.status);
    const json = await res.json();
    console.log("Response JSON:", json);
    return json;
  } catch (error) {
    console.error("Fetch error:", error);
    return { success: false, data: [], error: error.message };
  }
};


export const createEmployee = async (data) => {
  const res = await fetch(`${BASE_URL}/create_employee`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    console.error('🛑 خطأ في إنشاء الموظف:', json);
  }


  return json;
};

export const updateEmployee = async (id, data) => {
  const res = await fetch(`${BASE_URL}/update_one_employee/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

const json = await res.json();
if (!res.ok) {
    console.error('🛑 خطأ في إنشاء الموظف:', json);
  }


  return json;
};

export const deleteEmployee = async (id) => {
  const res = await fetch(`${BASE_URL}/delete_one_employee/${id}`, {
    method: 'DELETE',
  });
  return await res.json();
};
