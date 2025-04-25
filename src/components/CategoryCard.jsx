import React from 'react';

const CategoryCard = ({ src }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-md">
      <img src={src} alt="category" className="w-full h-32 object-cover" />
    </div>
  );
};

export default CategoryCard;