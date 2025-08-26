// src/services/publicMenu.js
import { BASE_URL } from "../utils/api";

// بترجع Array فيه كل الكاتيجوريز وكل كاتيجوري بداخله items[]
export const getPublicMenu = async () => {
  // 1) جيب الكاتيجوريز
  const catRes = await fetch(`${BASE_URL}/get_categories`);
  const catJson = await catRes.json();
  const categories = catJson?.data || [];

  // 2) جيب آيتِمز كل كاتيجوري على حدة (بشكل متوازي)
  const categoriesWithItems = await Promise.all(
    categories.map(async (cat) => {
      const itemsRes = await fetch(`${BASE_URL}/get_items?categoryId=${cat.id}`);
      const itemsJson = await itemsRes.json();
      return {
        ...cat,
        items: itemsJson?.data || [],
      };
    })
  );

  return categoriesWithItems;
};
