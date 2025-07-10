import React from 'react';
import { BASE_IMAGE_URL } from '@/utils/api';

const CategoryCard = ({ src, name }) => {
  return (
    <div className="w-full h-48 rounded-lg overflow-hidden shadow-md bg-gray-100">
      <img
        src={BASE_IMAGE_URL + src}
        alt={name}
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
};

export default CategoryCard;
