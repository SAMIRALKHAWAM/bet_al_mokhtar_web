import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCard from '@/components/CategoryCard';
import { getCategories } from '@/services/categoryService';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch((error) => console.error('خطأ أثناء جلب الأصناف:', error));
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-3xl font-bold text-center text-red-700 mb-10">الأصناف</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-10">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigate(`/categories/${cat.id}`)}
            className="cursor-pointer hover:scale-105 transition"
          >
            <CategoryCard src={cat.image} name={cat.name} />
            <h3 className="text-center text-lg font-semibold mt-2 text-gray-700">{cat.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
