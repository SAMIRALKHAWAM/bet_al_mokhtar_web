import React from 'react';

const discounts = [
  { img: '/images/dish1.jpg', percent: '20%' },
  { img: '/images/dish2.jpg', percent: '70%' },
  { img: '/images/dish3.jpg', percent: '75%' },
  { img: '/images/dish4.jpg', percent: '80%' },
];

const DiscountSlider = () => {
  return (
    <div className="bg-red-600 text-white p-8 rounded-xl m-10">
      <h2 className="text-xl font-bold mb-4">WELCOME TO BEIT ALMUKHTAR !</h2>
      <div className="flex gap-8 overflow-x-auto">
        {discounts.map((item, i) => (
          <div key={i} className="min-w-[250px]">
            <img
              src={item.img}
              alt="discount"
              className="rounded-md w-full h-24 object-cover"
            />
            <p className="font-bold text-center">Discount {item.percent}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscountSlider;