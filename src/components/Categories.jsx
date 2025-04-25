import React from 'react';
import CategoryCard from './CategoryCard';

const items = [
  '/images/dish5.jpg',
  '/images/dish6.jpg',
  '/images/dish7.jpg',
  '/images/dish8.jpg',
  '/images/beit almokhtar.jpg',
];

const Categories = () => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold m-8">Categories</h2>
     <button>
     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-10">
        {items.map((src, idx) => (
          <CategoryCard key={idx} src={src} />
        ))}
      </div>
      </button> 
    
    </div>
  );
};

export default Categories;