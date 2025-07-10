import { BASE_URL } from "../utils/api";

export const getEmployees = async () => {
  const res = await fetch(`${BASE_URL}/get_employees`);
  return await res.json();
};

export const createEmployee = async (data) => {
  const res = await fetch(`${BASE_URL}/create_employee`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const updateEmployee = async (id, data) => {
  const res = await fetch(`${BASE_URL}/update_one_employee/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const deleteEmployee = async (id) => {
  const res = await fetch(`${BASE_URL}/delete_one_employee/${id}`, {
    method: 'DELETE',
  });
  return await res.json();
};
