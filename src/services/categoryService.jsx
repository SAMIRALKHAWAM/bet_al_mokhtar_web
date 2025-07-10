import { BASE_URL } from '@/utils/api';

export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/get_categories`);
  const data = await res.json();
  return data.data;
};

export const getCategoryById = async (id) => {
  const res = await fetch(`${BASE_URL}/get_one_category/${id}`);
  const data = await res.json();
  return data.data;
};

export const createCategory = async (formData) => {
  const res = await fetch(`${BASE_URL}/create_category`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
};

export const updateCategory = async (id, formData) => {
  const res = await fetch(`${BASE_URL}/update_one_category/${id}`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
};

export const deleteCategory = async (id) => {
  const res = await fetch(`${BASE_URL}/delete_one_category/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};
