import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ src }) => {
  return (
    <div className="w-full h-48 rounded-lg overflow-hidden shadow-md bg-gray-100">
      <img
        src={src}
        alt="Category"
        className="w-full h-full object-cover object-center"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
        }}
      />
    </div>
  );
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://192.168.17.1:8000/api/admin/get_categories')
      .then((res) => res.json())
      .then((data) => {
        if(data.success){
          setCategories(data.data);
        } else {
          console.error('Failed to load categories:', data.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const baseImageUrl = 'http://192.168.17.1:8000/storage/';

  return (
    <div className="mt-6">
      <h2 className="text-3xl font-bold text-center text-red-700 mb-10">الأقسام</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-10">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigate(`/categories/${cat.id}`)}
            className="cursor-pointer hover:scale-105 transition"
          >
            <CategoryCard src={baseImageUrl + cat.image} />
            <h3 className="text-center text-lg font-semibold mt-2 text-gray-700">{cat.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
