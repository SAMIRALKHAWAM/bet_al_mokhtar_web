import { BASE_URL } from '../utils/api';

export const fetchItemsByCategory = async (categoryId) => {
  const res = await fetch(`${BASE_URL}/get_items?categoryId=${categoryId}`);
  const data = await res.json();
  if (data.success) return data.data;
  throw new Error('Failed to fetch items');
};

export const createItem = async (formData) => {
  const data = new FormData();
  data.append('name', formData.name);
  data.append('description', formData.description);
  data.append('price', formData.price);
  data.append('category_id', formData.category_id);

  formData.images.forEach((img, i) => {
    data.append(`images[${i}]`, img);
  });

  const res = await fetch(`${BASE_URL}/create_item`, {
    method: 'POST',
    body: data,
  });

  const result = await res.json();
  if (!result.success) throw new Error('Failed to create item');
  return result;
};

export const updateItem = async (itemId, formData) => {
  const data = new FormData();
  data.append('name', formData.name);
  data.append('description', formData.description);
  data.append('price', formData.price);

  formData.images.forEach((img, i) => {
    data.append(`images[${i}]`, img);
  });

  const res = await fetch(`${BASE_URL}/update_one_item/${itemId}`, {
    method: 'POST',
    body: data,
  });

  const result = await res.json();
  if (!result.success) throw new Error('Failed to update item');
  return result;
};

export const deleteItem = async (itemId) => {
  const res = await fetch(`${BASE_URL}/delete_one_item/${itemId}`, {
    method: 'DELETE',
  });
  const result = await res.json();
  if (!result.success) throw new Error('Failed to delete item');
  return result;
};

export const deleteItemImage = async (itemId, imageId) => {
  const data = new FormData();
  data.append('images[0]', imageId);

  const res = await fetch(`${BASE_URL}/delete_item_images/${itemId}`, {
    method: 'POST',
    body: data,
  });
  const result = await res.json();
  if (!result.success) throw new Error('Failed to delete image');
  return result;
};
